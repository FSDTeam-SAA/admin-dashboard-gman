"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryForm({
  category,
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const session = useSession();
  const token = (session?.data as { accessToken?: string })?.accessToken;


  // Inside your component
  const queryClient = useQueryClient();

  const saveCategoryMutation = useMutation({
    mutationFn: async (formData: { name: string; description: string }) => {
      const url = category
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;

      const method = category ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Category saved successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refresh categories list
      onSuccess(); // Close the form or perform other success actions
    },
    onError: () => {
      toast.error("Failed to save category");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCategoryMutation.mutate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#039B06] cursor-pointer hover:bg-[#014A14]">{category ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
