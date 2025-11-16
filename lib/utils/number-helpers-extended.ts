// Extended number utility functions

/**
 * Clamps number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Rounds to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Floors to specified decimal places
 */
export function floorTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.floor(value * factor) / factor
}

/**
 * Ceils to specified decimal places
 */
export function ceilTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.ceil(value * factor) / factor
}

/**
 * Checks if number is between two values
 */
export function isBetween(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Checks if number is positive
 */
export function isPositive(value: number): boolean {
  return value > 0
}

/**
 * Checks if number is negative
 */
export function isNegative(value: number): boolean {
  return value < 0
}

/**
 * Checks if number is zero
 */
export function isZero(value: number): boolean {
  return value === 0
}

/**
 * Checks if number is integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value)
}

/**
 * Checks if number is even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0
}

/**
 * Checks if number is odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0
}

/**
 * Gets percentage of value
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Gets value from percentage
 */
export function fromPercentage(percent: number, total: number): number {
  return (percent / 100) * total
}

/**
 * Calculates percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Formats number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Parses number from string
 */
export function parseNumber(str: string): number | null {
  const parsed = parseFloat(str)
  return isNaN(parsed) ? null : parsed
}

/**
 * Generates random number between min and max
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Calculates average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return sum / numbers.length
}

/**
 * Calculates sum of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0)
}

/**
 * Gets minimum value
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers)
}

/**
 * Gets maximum value
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers)
}

/**
 * Calculates median
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

