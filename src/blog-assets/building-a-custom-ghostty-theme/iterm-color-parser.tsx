"use client";

import { Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Textarea } from "#/components/ui/textarea";

// Custom hook for copying to clipboard
function useCopyToClipboard() {
  let copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return copy;
}

// Helper function to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number) {
  // biome-ignore lint/style/useTemplate: <explanation>
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Helper function to parse color from XML
const parseColor = (colorElement: Element) => {
  let children = [...colorElement.children];
  let redEl = children.find(
    (child) => child.tagName === "key" && child.textContent === "Red Component",
  );
  let greenEl = children.find(
    (child) =>
      child.tagName === "key" && child.textContent === "Green Component",
  );
  let blueEl = children.find(
    (child) =>
      child.tagName === "key" && child.textContent === "Blue Component",
  );

  if (!redEl || !greenEl || !blueEl) {
    return { hex: "", rgba: "" };
  }

  let red = Number.parseFloat(redEl.nextElementSibling?.textContent || "0");
  let green = Number.parseFloat(greenEl.nextElementSibling?.textContent || "0");
  let blue = Number.parseFloat(blueEl.nextElementSibling?.textContent || "0");

  let r = Math.round(red * 255);
  let g = Math.round(green * 255);
  let b = Math.round(blue * 255);

  let hex = rgbToHex(r, g, b);
  let rgba = `rgba(${r}, ${g}, ${b}, 1)`;

  return { hex, rgba };
};

function generateTemplate(
  colors: Record<string, { hex: string; rgba: string }>,
) {
  let template = `palette = 0=${colors["Ansi 0 Color"]?.hex || ""}
palette = 1=${colors["Ansi 1 Color"]?.hex || ""}
palette = 2=${colors["Ansi 2 Color"]?.hex || ""}
palette = 3=${colors["Ansi 3 Color"]?.hex || ""}
palette = 4=${colors["Ansi 4 Color"]?.hex || ""}
palette = 5=${colors["Ansi 5 Color"]?.hex || ""}
palette = 6=${colors["Ansi 6 Color"]?.hex || ""}
palette = 7=${colors["Ansi 7 Color"]?.hex || ""}
palette = 8=${colors["Ansi 8 Color"]?.hex || ""}
palette = 9=${colors["Ansi 9 Color"]?.hex || ""}
palette = 10=${colors["Ansi 10 Color"]?.hex || ""}
palette = 11=${colors["Ansi 11 Color"]?.hex || ""}
palette = 12=${colors["Ansi 12 Color"]?.hex || ""}
palette = 13=${colors["Ansi 13 Color"]?.hex || ""}
palette = 14=${colors["Ansi 14 Color"]?.hex || ""}
palette = 15=${colors["Ansi 15 Color"]?.hex || ""}
background = ${colors["Background Color"]?.hex || ""}
foreground = ${colors["Foreground Color"]?.hex || ""}
cursor-color = ${colors["Cursor Color"]?.hex || ""}
selection-background = ${colors["Selection Color"]?.hex || ""}
selection-foreground = ${colors["Selected Text Color"]?.hex || ""}`;

  return template;
}

export function ItermColorParser() {
  let [xmlData, setXmlData] = useState("");
  let [colors, setColors] = useState<
    Record<string, { hex: string; rgba: string }>
  >({});
  let [template, setTemplate] = useState("");
  let copyToClipboard = useCopyToClipboard();

  function parseXml() {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlData, "text/xml");
    let dictElement = xmlDoc.querySelector("dict");

    if (dictElement) {
      let newColors: Record<string, { hex: string; rgba: string }> = {};
      let keyElements = dictElement.querySelectorAll("key");

      for (let keyElement of keyElements) {
        let colorName = keyElement.textContent;
        let colorElement = keyElement.nextElementSibling;

        if (colorName && colorElement && colorElement.tagName === "dict") {
          newColors[colorName] = parseColor(colorElement);
        }
      }

      setColors(newColors);
      setTemplate(generateTemplate(newColors));
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>iTerm Color Scheme Parser</CardTitle>
        <CardDescription>
          Paste your iTerm color scheme XML below to extract colors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your iTerm color scheme XML here..."
          value={xmlData}
          onChange={(e) => setXmlData(e.target.value)}
          className="min-h-[200px]"
        />
        <Button onClick={parseXml}>Parse Colors</Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(colors).map(([name, { hex, rgba }]) => (
            <Card key={name} className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-semibold">{name}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Hex:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(hex)}
                  >
                    {hex}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>RGBA:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(rgba)}
                  >
                    {rgba}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {template && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Template</CardTitle>
              <CardDescription>
                Copy the generated template for use in other applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{template}</code>
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(template)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy template</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
