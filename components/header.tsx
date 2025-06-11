"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { data: session } = useSession()




  const userName = session?.user?.name || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="bg-[#014A14] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{userName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback >{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
