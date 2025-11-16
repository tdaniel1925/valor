"use client"

import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip/tooltip"

interface InfoTooltipProps {
  content: string
  className?: string
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 text-muted-foreground cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

