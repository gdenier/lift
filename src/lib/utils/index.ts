import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createFormData(values: Record<string, any>) {
  const data = new FormData()
  Object.entries(values).forEach(([key, value]) => data.append(key, value))
  return data
}

/**
 * Format the weight with right unit.
 *
 * @param value weight in gramme
 */
export function formatWeight(value: number): string {
  if (value === 0) return "PDC"
  if (value > 1000) {
    const weight = +(Math.round(+(value / 1000 + "e+2")) + "e-2")
    return new Intl.NumberFormat("fr-FR", {
      style: "unit",
      unit: "kilogram",
    }).format(weight)
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "unit",
    unit: "gram",
  }).format(value)
}

/**
 * Format the time with right unit.
 *
 * @param value time in second
 */
export function formatTime(value: number): string {
  if (!value)
    return new Intl.NumberFormat("fr-FR", {
      style: "unit",
      unit: "second",
    }).format(value)
  const hour = Math.trunc(value / 3600)
  const minute = Math.trunc((value - hour * 3600) / 60)
  const second = value - minute * 60 - hour * 3600
  return `${
    hour
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "hour",
        }).format(hour)
      : ""
  } ${
    minute
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "minute",
        }).format(minute)
      : ""
  } ${
    second
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "second",
        }).format(second)
      : ""
  }`
}
