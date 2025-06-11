"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Blog {
  _id: string
  blogName: string
  description: string
  thumbnail: {
    url: string
    public_id: string
  }
  createdAt: string
  updatedAt: string
}

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPage: 1,
  })

  useEffect(() => {
    fetchBlogs()
  }, [pagination.page])

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs?page=${pagination.page}&limit=${pagination.limit}`,
      )
      const data = await response.json()
      if (data.success) {
        setBlogs(data.data.blogs)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog management</h1>
          <nav className="text-sm text-gray-500">Dashboard &gt; Blog management &gt; List</nav>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Image
                src={blog.thumbnail.url || "/placeholder.svg"}
                alt={blog.blogName}
                width={80}
                height={60}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{blog.blogName}</h3>
                <p className="text-sm text-gray-600 mt-1">{blog.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                Added
                <br />
                {new Date(blog.createdAt).toLocaleDateString()} {new Date(blog.createdAt).toLocaleTimeString()}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(blog._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing 1 to {blogs.length} of {pagination.total} results
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page > 1) {
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.totalPage }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      isActive={pagination.page === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        setPagination((prev) => ({ ...prev, page: i + 1 }))
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page < pagination.totalPage) {
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
