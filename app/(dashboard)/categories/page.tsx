"use client";

import { useState } from "react";
import CategoryList from "./_components/category-list";
import CategoryForm from "./_components/category-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Categories
            </h1>
            <p className="text-gray-600">Manage product categories</p>
          </div>
          <Breadcrumb className="flex items-center justify-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Categories</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-[#039B06]">+ Add Category</Button>
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

      <CategoryList
        onEdit={setEditingCategory}
      />
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
