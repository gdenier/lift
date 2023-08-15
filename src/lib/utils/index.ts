import { EmailAddress } from "@clerk/nextjs/dist/types/server"
import { type ClassValue, clsx } from "clsx"
import { ToastOptions, toast } from "react-hot-toast"
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
export function formatWeight(
  value: number,
  options: { withUnit?: boolean } | undefined = { withUnit: true }
): string | number {
  if (value === 0) return options?.withUnit ? "PDC" : 0
  if (value > 1000) {
    const weight = +(Math.round(+(value / 1000 + "e+2")) + "e-2")
    return options?.withUnit
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "kilogram",
        }).format(weight)
      : weight
  }
  if (value === 1000) {
    return options?.withUnit
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "kilogram",
        }).format(1)
      : 1
  }
  return options?.withUnit
    ? new Intl.NumberFormat("fr-FR", {
        style: "unit",
        unit: "gram",
      }).format(value)
    : value
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

  if (value === 60)
    return new Intl.NumberFormat("fr-FR", {
      style: "unit",
      unit: "second",
      unitDisplay: "narrow",
    }).format(value)
  const hour = Math.trunc(value / 3600)
  const minute = Math.trunc((value - hour * 3600) / 60)
  const second = value - minute * 60 - hour * 3600
  return `${
    hour
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "hour",
          unitDisplay: "narrow",
        }).format(hour)
      : ""
  }${
    minute
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "minute",
          unitDisplay: "narrow",
        }).format(minute)
      : ""
  }${
    second
      ? new Intl.NumberFormat("fr-FR", {
          style: "unit",
          unit: "second",
          unitDisplay: "narrow",
        }).format(second)
      : ""
  }`
}

export function formatUsername(user: {
  firstname?: string | null
  lastname?: string | null
  fullName?: string | null
  username?: string | null
  emailAddresses: EmailAddress[]
}): string {
  if (user.username) return user.username
  if (user.fullName) return user.fullName
  if (user.firstname && user.lastname)
    return `${user.firstname} ${user.lastname}`
  if (user.firstname) return user.firstname
  if (user.lastname) return user.lastname
  return user.emailAddresses[0].emailAddress
}
