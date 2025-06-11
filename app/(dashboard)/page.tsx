
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck } from "lucide-react"

// async function getOverviewData(accessToken?: string) {
//   try {
//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//     }

//     if (accessToken) {
//       headers.Authorization = `Bearer ${accessToken}`
//     }

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/overview`, {
//       cache: "no-store",
//       headers,
//     })

//     if (!response.ok) throw new Error("Failed to fetch")
//     const data = await response.json()
//     return data.data
//   } catch (error) {
//     console.error("Error fetching overview:", error)
//     return { totalSellers: 0, totalUsers: 0 }
//   }
// }

export default async function Dashboard() {
  // const session = await getServerSession(authOptions)
  // const overviewData = await getOverviewData(session?.accessToken)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Table Fresh Admin Dashboard, </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
