import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
  size?: "sm" | "md" | "lg"
}

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
  
  // Contract/User statuses
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
}

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800"
  const formattedStatus = status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {formattedStatus}
    </span>
  )
}

