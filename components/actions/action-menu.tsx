"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionMenuItem {
  label: string
  onClick: () => void
  variant?: "default" | "destructive"
  icon?: React.ReactNode
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  align?: "start" | "end"
}

export function ActionMenu({ items, align = "end" }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, index) => (
          <div key={index}>
            {item.variant === "destructive" && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              className={item.variant === "destructive" ? "text-destructive" : ""}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

