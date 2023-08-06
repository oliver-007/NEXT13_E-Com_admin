"use client";

import { Plus } from "lucide-react";
import { Heading } from "./ui/Heading";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Separator } from "./ui/separator";
import { DataTable } from "./ui/Data-table";
import { ApiList } from "./ui/Api-list";
import { ProductColumn, columns } from "./Product-columns";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between  ">
        <Heading
          title={`Products (${data.length}) `}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4 " />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Products " />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
