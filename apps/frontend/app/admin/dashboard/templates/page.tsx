"use client";
import DashboardLayout from "@/layout/dashboard";
import { List } from "ui/icons";
import Header from "./header";
import Helper from "@/components/helper";
import { rspc } from "@/rspc/utils";
import dayjs from "dayjs";
import RowActions from "./row-actions";
import { useMemo, useState } from "react";
import { DataTable } from "ui";
import { columns } from "./columnDef";

const Lists = () => {
  const lists = rspc.useQuery(["templates.get_all"]);


  return (
    <DashboardLayout icon={<List />} name="Lists">
      <DataTable
        Header={Header}
        columns={columns}
        filterColumn="name"
        data={
          lists.data?.map((list) => {
            return {
              id: list.id,
              name: list.name,
              createdAt: dayjs(list.created_at).format("DD/MM/YYYY"),
              updatedAt: dayjs(list.updated_at).format("DD/MM/YYYY"),
              identifier: list.identifier,
            };
          }) ?? []
        }
      />
      <Helper text="Lists are groups of subscribers who are interested on a common topic. You can create a list and add subscribers to it. Further you can send campaigns to these lists." />
    </DashboardLayout>
  );
};

export default Lists;
