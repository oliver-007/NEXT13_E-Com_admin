"use client";

import { Plus } from "lucide-react";
import { Heading } from "./ui/Heading";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Separator } from "./ui/separator";
import { DataTable } from "./ui/Data-table";
import { ApiList } from "./ui/Api-list";
import { CategoryColumn, columns } from "./Category-columns ";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between  ">
        <Heading
          title={`Categories (${data.length}) `}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4 " />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Categories " />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
