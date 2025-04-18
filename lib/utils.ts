import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isServer = typeof window === 'undefined'

export function formatDate(date?: Date | null, fallback?: string | null): string | null | undefined {
  if (!date) return fallback
  const newDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))
  return newDate.toISOString().split("T")[0]
}
