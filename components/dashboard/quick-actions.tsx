"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Briefcase, FileCheck } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Quote",
      description: "Create a new insurance quote",
      icon: FileText,
      href: "/quotes/new",
      color: "text-blue-600",
    },
    {
      title: "New Case",
      description: "Create a new case",
      icon: Briefcase,
      href: "/cases/new",
      color: "text-green-600",
    },
    {
      title: "Request Contract",
      description: "Request a new carrier contract",
      icon: FileCheck,
      href: "/contracts/new",
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col items-start p-4 hover:bg-muted"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className={`h-5 w-5 ${action.color}`} />
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

