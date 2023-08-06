"use client";

import { Plus } from "lucide-react";
import { Heading } from "./ui/Heading";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./Billboard-columns";
import { Separator } from "./ui/separator";
import { DataTable } from "./ui/Data-table";
import { ApiList } from "./ui/Api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between  ">
        <Heading
          title={`Billboards (${data.length}) `}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4 " />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API calls for Billboards " />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
