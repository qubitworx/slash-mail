"use client";
import { rspc } from "@/rspc/utils";
import { DataTable } from "ui";
import { columns } from "./columnDef";
import Header from "../header";

const List = () => {
  const subscribers = rspc.useQuery([
    "subscriber.get_all",
    {
      name: "",
      skip: 0,
      take: 10,
    },
  ]);

  if (subscribers.isLoading) {
    return null;
  }

  return (
    <>
      <DataTable
        filterColumn="name"
        Header={Header}
        columns={columns}
        data={
          subscribers.data?.map((sub) => {
            return {
              id: sub.id,
              name: sub.name,
              email: sub.email,
              status: sub.status.toUpperCase(),
            };
          }) ?? []
        }
      />
    </>
  );
};

export default List;
