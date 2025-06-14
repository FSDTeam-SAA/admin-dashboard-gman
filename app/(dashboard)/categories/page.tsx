"use client";

import { useState } from "react";
import CategoryList from "./_components/category-list";
import CategoryForm from "./_components/category-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Categories List
            </h1>
            <p className="text-gray-600">Manage product categories</p>
          </div>
          <Breadcrumb className="flex items-center justify-center space-x-1">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            &gt;
            <BreadcrumbItem>
              <BreadcrumbLink className="ml-1">Categories &gt; List</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#039B06] hover:bg-[#014A14] cursor-pointer"
        >
          + Add Category
        </Button>
      </div>

      {showCreateForm && (
        <CategoryForm
          category={null}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => setEditingCategory(null)}
        />
      )}

      <CategoryList onEdit={setEditingCategory} />
    </div>
  );
}

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
