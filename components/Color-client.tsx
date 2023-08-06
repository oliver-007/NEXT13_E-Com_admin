"use client";

import { Plus } from "lucide-react";
import { Heading } from "./ui/Heading";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Separator } from "./ui/separator";
import { DataTable } from "./ui/Data-table";
import { ApiList } from "./ui/Api-list";
import { columns } from "./Size-column";
import { ColorColumn } from "./Color-column";

interface ColorsClientProps {
  data: ColorColumn[];
}

export const ColorClient: React.FC<ColorsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between  ">
        <Heading
          title={`Colors (${data.length}) `}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4 " />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Colors " />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
