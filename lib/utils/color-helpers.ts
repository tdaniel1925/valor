// Color utility functions

/**
 * Gets status color class based on status value
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Case statuses
    draft: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    pending_requirements: "bg-orange-100 text-orange-800",
    issued: "bg-purple-100 text-purple-800",
    
    // Commission statuses
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    
    // Contract statuses
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  }

  return statusColors[status] || "bg-gray-100 text-gray-800"
}

/**
 * Gets status icon based on status value
 */
export function getStatusIcon(status: string): string {
  const statusIcons: Record<string, string> = {
    draft: "📝",
    submitted: "📤",
    under_review: "👀",
    approved: "✅",
    rejected: "❌",
    pending_requirements: "⏳",
    issued: "📄",
    pending: "⏳",
    paid: "💰",
    cancelled: "🚫",
    active: "✅",
    inactive: "⏸️",
  }

  return statusIcons[status] || "📋"
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Gets contrast color (black or white) for a background color
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return "#000000"

  // Calculate relative luminance
  const luminance =
    (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255

  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

