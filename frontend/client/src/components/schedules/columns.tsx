"use client"

import { ColumnDef, CellContext } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocation } from "wouter"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Schedule = {
  id: string
  bus: {
    name: string
    registrationNumber: string
  }
  route: {
    origin: string
    destination: string
  }
  departureTime: string
  arrivalTime: string
}

export const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "bus.name",
    header: "Bus",
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }: CellContext<Schedule, unknown>) => {
        const route = row.original.route
        return <div>{route ? `${route.origin} to ${route.destination}` : "Route not available"}</div>
    }
  },
  {
    accessorKey: "departureTime",
    header: "Departure",
    cell: ({ row }: CellContext<Schedule, unknown>) => {
        const date = new Date(row.getValue("departureTime"))
        return <div>{date.toLocaleString()}</div>
    }
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival",
    cell: ({ row }: CellContext<Schedule, unknown>) => {
        const date = new Date(row.getValue("arrivalTime"))
        return <div>{date.toLocaleString()}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }: CellContext<Schedule, unknown>) => {
      const schedule = row.original
      const [, setLocation] = useLocation()
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(schedule.id)}
            >
              Copy schedule ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLocation(`/schedules/${schedule.id}/edit`)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
