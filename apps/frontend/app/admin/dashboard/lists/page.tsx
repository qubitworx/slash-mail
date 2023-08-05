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
  const lists = rspc.useQuery(["list.get_all"]);
  const [searchQuery, setSearchQuery] = useState("");

  const final_list = useMemo(() => {
    if (searchQuery === "") {
      return lists.data || [];
    }
    return (
      lists.data?.filter((list) => {
        return list.name.toLowerCase().includes(searchQuery.toLowerCase());
      }) || []
    );
  }, [lists.data, searchQuery]);

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
              description: list.description,
              requires_confirmation: list.requires_confirmation,
            };
          }) ?? []
        }
      />
      <Helper text="Lists are groups of subscribers who are interested on a common topic. You can create a list and add subscribers to it. Further you can send campaigns to these lists." />
    </DashboardLayout>
  );
};

export default Lists;
