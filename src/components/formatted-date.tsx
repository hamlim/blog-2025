"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "#/utils/date-formatting";

export function FormattedDate({
  date,
}: {
  date: string | number | Date;
}): ReactNode {
  let [formattedDate, setFormattedDate] = useState("....");

  useEffect(() => {
    setFormattedDate(formatDate(new Date(date)));
  }, [date]);

  return <span>{formattedDate}</span>;
}

export function FormattedDateTime({
  date,
}: {
  date: string | number | Date;
}): ReactNode {
  let [formattedDateTime, setFormattedDateTime] = useState("....");

  useEffect(() => {
    setFormattedDateTime(formatDateTime(new Date(date)));
  }, [date]);

  return <span>{formattedDateTime}</span>;
}
