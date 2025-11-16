"use client"

import { MoreHorizontal, Edit, Trash2, Eye, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TableAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
}

interface TableActionsProps {
  actions: TableAction[]
  align?: "start" | "end"
}

export function TableActions({ actions, align = "end" }: TableActionsProps) {
  const defaultActions = actions.filter((a) => a.variant !== "destructive")
  const destructiveActions = actions.filter((a) => a.variant === "destructive")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {defaultActions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
        {destructiveActions.length > 0 && defaultActions.length > 0 && (
          <DropdownMenuSeparator />
        )}
        {destructiveActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className="text-destructive"
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Common action presets
export const commonTableActions = {
  view: (onClick: () => void): TableAction => ({
    label: "View",
    icon: <Eye className="h-4 w-4" />,
    onClick,
  }),
  edit: (onClick: () => void): TableAction => ({
    label: "Edit",
    icon: <Edit className="h-4 w-4" />,
    onClick,
  }),
  copy: (onClick: () => void): TableAction => ({
    label: "Copy",
    icon: <Copy className="h-4 w-4" />,
    onClick,
  }),
  delete: (onClick: () => void): TableAction => ({
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    onClick,
    variant: "destructive",
  }),
}

