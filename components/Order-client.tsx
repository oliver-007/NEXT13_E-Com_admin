"use client";

import { Heading } from "./ui/Heading";
import { Separator } from "./ui/separator";
import { DataTable } from "./ui/Data-table";
import { OrderColumn, columns } from "./Order-columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length}) `}
        description="Manage Orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
