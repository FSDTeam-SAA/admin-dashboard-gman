"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Save } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { RichTextEditor } from "./rich-text-editor"

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

interface BlogFormProps {
  blog?: Blog | null
  onClose: () => void
  onSuccess: () => void
}

export function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.blogName || "")
  const [description, setDescription] = useState(blog?.description || "")
  const [content, setContent] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(blog?.thumbnail.url || "")
console.log(setDescription)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const session = useSession()
  const token = (session?.data as { accessToken?: string })?.accessToken

  const saveBlogMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = blog
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${blog._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs`

      const response = await fetch(url, {
        method: blog ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save blog")
      }
      return response.json()
    },
    onSuccess: () => {
      onSuccess()
    },
  })

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("blogName", title)
    formData.append("description", content)

    if (thumbnail) {
      formData.append("thumbnail", thumbnail)
    }

    saveBlogMutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog management</h1>
          <nav className="text-sm text-gray-500">
            Dashboard &gt; Blog management &gt; {blog ? "Edit blog" : "Add blog"}
          </nav>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSubmit}
          disabled={saveBlogMutation.isPending || !title.trim()}
        >
          <Save className="h-4 w-4 mr-2" />
          {saveBlogMutation.isPending ? "Saving..." : "Save Blog"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Blog Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add your title..."
                  className="text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <RichTextEditor
                  content={description}
                  onChange={setContent}
                  placeholder="Start writing your blog content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-4">Thumbnail</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="space-y-4">
                    <Image
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      width={200}
                      height={150}
                      className="mx-auto rounded object-cover"
                    />
                    <p className="text-sm text-gray-500">Click to change thumbnail</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={saveBlogMutation.isPending || !title.trim()}
            >
              {saveBlogMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
