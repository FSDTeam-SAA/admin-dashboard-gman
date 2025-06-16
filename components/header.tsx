"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"

export function Header() {
  const { data: session } = useSession()
  const token = (session as { accessToken?: string })?.accessToken

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) throw new Error("No access token available")
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Network response was not ok')
      
      return await response.json()
    },
    enabled: !!token,
  })

  const userData = profileData?.data
  const userName = userData?.name || userData?.username || session?.user?.name || "User"
  const userAvatar = userData?.avatar?.url
  const userRole = userData?.role
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header className="bg-[#014A14] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">Loading...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">Error loading profile</span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">{userName}</span>
              {userRole && (
                <span className="text-[10px] text-gray-300 capitalize">{userRole}</span>
              )}
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                  <AvatarFallback>
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}