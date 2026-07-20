/// <reference types="bun" />
/**
 * Generates the steps + weight charts for the /2026/july/32 birthday post.
 *
 * Input: a CSV (date,steps,weight) exported from the Memex > Daily Notion DB.
 * The raw data intentionally lives outside the repo — pass its path as the
 * first argument:
 *
 *   bun run scripts/birthday/generate-32-charts.ts ~/Downloads/daily-health.csv
 *
 * Output: light/dark PNGs (no numeric scales, labels only) in public/images/32/
 */
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

let csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: bun run scripts/birthday/generate-32-charts.ts <csv>");
  process.exit(1);
}

type Row = { date: string; steps: number | null; weight: number | null };

let rows: Array<Row> = (await Bun.file(csvPath).text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    let [date, steps, weight] = line.split(",");
    return {
      date: date as string,
      steps: steps ? Number(steps) : null,
      weight: weight ? Number(weight) : null,
    };
  });

// A "birthday year" runs Aug 1 -> Jul 31 the following year
function birthdayYear(date: string): number {
  let [y, m] = date.split("-").map(Number) as [number, number];
  return m >= 8 ? y : y - 1;
}

function dayOffset(date: string): number {
  let start = Date.UTC(birthdayYear(date), 7, 1);
  return Math.round((Date.parse(`${date}T00:00:00Z`) - start) / 86400000);
}

type Point = { x: number; y: number };
type Series = { year: number; label: string; points: Array<Point> };

function buildSeries(
  metric: "steps" | "weight",
  smoothWindow: number,
): Array<Series> {
  let byYear = new Map<number, Array<{ x: number; y: number }>>();
  for (let row of rows) {
    let value = row[metric];
    if (value == null) continue;
    let year = birthdayYear(row.date);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)?.push({ x: dayOffset(row.date), y: value });
  }
  return [...byYear.entries()]
    .filter(([, points]) => points.length >= 5)
    .sort(([a], [b]) => a - b)
    .map(([year, points]) => {
      points.sort((a, b) => a.x - b.x);
      if (smoothWindow > 1) {
        points = points.map((point) => {
          let inWindow = points.filter(
            (p) => p.x > point.x - smoothWindow && p.x <= point.x,
          );
          return {
            x: point.x,
            y: inWindow.reduce((sum, p) => sum + p.y, 0) / inWindow.length,
          };
        });
      }
      return {
        year,
        label: `’${String(year).slice(2)}–’${String(year + 1).slice(2)}`,
        points,
      };
    });
}

// ---- theme (hex conversions of the oklch vars in src/styles.css) ----

type Theme = {
  surface: string;
  ink: string;
  mutedInk: string;
  grid: string;
  // fixed year -> hue mapping so a year keeps its color in every chart;
  // both palettes pass all six checks in the dataviz palette validator
  // against their surface (adjacent-pair CVD ΔE, chroma, contrast, band)
  colors: Record<number, string>;
};

let themes: Record<"light" | "dark", Theme> = {
  light: {
    surface: "#f9f5ee",
    ink: "#402622",
    mutedInk: "#6e4c41",
    grid: "#e0d6c9",
    colors: {
      2021: "#9f1239",
      2022: "#6d28d9",
      2023: "#b45309",
      2024: "#2563eb",
      2025: "#307b34",
    },
  },
  dark: {
    surface: "#1c2b1f",
    ink: "#efeae4",
    mutedInk: "#d9d0c3",
    grid: "#3c493b",
    colors: {
      2021: "#d8537b",
      2022: "#9b7df0",
      2023: "#c8800a",
      2024: "#4f8ce8",
      2025: "#41a246",
    },
  },
};

// dash patterns back color up as an identity carrier: dotted, short dash,
// long dash, dash-dot; the current year is the only solid line
let dashesByYear: Record<number, string> = {
  2021: "2 9",
  2022: "10 9",
  2023: "24 9",
  2024: "28 9 4 9",
};

let WIDTH = 2400;
let HEIGHT = 1200;
let MARGIN = { top: 170, right: 190, bottom: 110, left: 70 };
let MONTHS = ["A", "S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J"];
// cumulative day offsets of month starts within an Aug->Jul year
let MONTH_STARTS = [0, 31, 61, 92, 122, 153, 184, 212, 243, 273, 304, 334];

function renderChart({
  series,
  theme,
  title,
  yLabel,
}: {
  series: Array<Series>;
  theme: Theme;
  title: string;
  yLabel: string;
}): string {
  let plotW = WIDTH - MARGIN.left - MARGIN.right;
  let plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  let allY = series.flatMap((s) => s.points.map((p) => p.y));
  let minY = Math.min(...allY);
  let maxY = Math.max(...allY);
  let padY = (maxY - minY) * 0.06;
  minY -= padY;
  maxY += padY;

  let sx = (x: number) => MARGIN.left + (x / 365) * plotW;
  let sy = (y: number) =>
    MARGIN.top + plotH - ((y - minY) / (maxY - minY)) * plotH;

  let parts: Array<string> = [];
  parts.push(
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.surface}"/>`,
  );

  // horizontal gridlines, no numbers (scales intentionally removed)
  for (let i = 1; i <= 3; i++) {
    let y = MARGIN.top + (plotH / 4) * i;
    parts.push(
      `<line x1="${MARGIN.left}" y1="${y}" x2="${MARGIN.left + plotW}" y2="${y}" stroke="${theme.grid}" stroke-width="2"/>`,
    );
  }
  // baseline
  parts.push(
    `<line x1="${MARGIN.left}" y1="${MARGIN.top + plotH}" x2="${MARGIN.left + plotW}" y2="${MARGIN.top + plotH}" stroke="${theme.grid}" stroke-width="3"/>`,
  );

  // month labels along the x axis
  MONTH_STARTS.forEach((start, i) => {
    let mid = sx(start + 15);
    parts.push(
      `<text x="${mid}" y="${MARGIN.top + plotH + 54}" fill="${theme.mutedInk}" font-size="30" text-anchor="middle">${MONTHS[i]}</text>`,
    );
  });

  // series lines, oldest first so the current year draws on top
  series.forEach((s, i) => {
    let isCurrent = i === series.length - 1;
    let color = theme.colors[s.year] as string;
    let dash = isCurrent ? "" : ` stroke-dasharray="${dashesByYear[s.year]}"`;
    let width = isCurrent ? 5 : 3.5;

    // break the path where there's a gap of more than 14 days
    let segments: Array<Array<Point>> = [];
    for (let point of s.points) {
      let segment = segments[segments.length - 1];
      let prev = segment?.[segment.length - 1];
      if (segment && prev && point.x - prev.x <= 14) {
        segment.push(point);
      } else {
        segments.push([point]);
      }
    }

    for (let segment of segments) {
      if (segment.length < 2) {
        let p = segment[0] as Point;
        parts.push(
          `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="${width}" fill="${color}"/>`,
        );
        continue;
      }
      let d = segment
        .map(
          (p, j) =>
            `${j === 0 ? "M" : "L"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`,
        )
        .join(" ");
      parts.push(
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round" stroke-linejoin="round"/>`,
      );
    }
  });

  // legend row: swatch (with its dash pattern) + year label
  let legendX = MARGIN.left;
  series.forEach((s, i) => {
    let isCurrent = i === series.length - 1;
    let color = theme.colors[s.year] as string;
    let dash = isCurrent ? "" : ` stroke-dasharray="${dashesByYear[s.year]}"`;
    parts.push(
      `<line x1="${legendX}" y1="${MARGIN.top - 46}" x2="${legendX + 96}" y2="${MARGIN.top - 46}" stroke="${color}" stroke-width="${isCurrent ? 6 : 4.5}"${dash} stroke-linecap="round"/>`,
      `<text x="${legendX + 112}" y="${MARGIN.top - 34}" fill="${theme.ink}" font-size="34"${isCurrent ? ' font-weight="bold"' : ""}>${s.label}</text>`,
    );
    legendX += 112 + s.label.length * 20 + 56;
  });

  // direct label at the end of the current year's line
  let current = series[series.length - 1] as Series;
  let lastPoint = current.points[current.points.length - 1] as Point;
  let currentColor = theme.colors[current.year] as string;
  parts.push(
    `<circle cx="${sx(lastPoint.x)}" cy="${sy(lastPoint.y)}" r="9" fill="${currentColor}"/>`,
    `<text x="${sx(lastPoint.x) + 20}" y="${sy(lastPoint.y) + 11}" fill="${theme.ink}" font-size="34" font-weight="bold">${current.label}</text>`,
  );

  // axis title
  parts.push(
    `<text x="${MARGIN.left}" y="${HEIGHT - 28}" fill="${theme.mutedInk}" font-size="30">${yLabel}</text>`,
    `<text x="${MARGIN.left}" y="60" fill="${theme.ink}" font-size="42" font-weight="bold">${title}</text>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" font-family="Inter">${parts.join("\n")}</svg>`;
}

let interFont = path.join(
  import.meta.dirname,
  "../../node_modules/pikitia/assets/inter-regular.ttf",
);

async function writePng(svg: string, file: string) {
  let resvg = new Resvg(svg, {
    font: { fontFiles: [interFont], defaultFontFamily: "Inter" },
  });
  let png = resvg.render().asPng();
  let out = path.join(import.meta.dirname, "../../public/images/32", file);
  await Bun.write(out, png);
  console.log(`wrote ${out}`);
}

let steps = buildSeries("steps", 7);
let weight = buildSeries("weight", 1);

for (let mode of ["light", "dark"] as const) {
  let theme = themes[mode];
  await writePng(
    renderChart({
      series: steps,
      theme,
      title: "Steps per day",
      yLabel: "7-day average, August through July",
    }),
    `steps-per-day-${mode}.png`,
  );
  await writePng(
    renderChart({
      series: weight,
      theme,
      title: "Weight",
      yLabel: "Daily weigh-ins, August through July",
    }),
    `weight-per-day-${mode}.png`,
  );
}
