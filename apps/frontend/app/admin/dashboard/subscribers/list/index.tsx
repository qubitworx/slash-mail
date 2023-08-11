"use client";
import { rspc } from "@/rspc/utils";
import { DataTable } from "ui";
import { columns } from "./columnDef";
import Header from "../header";
import { useState } from "react";

const List = () => {
  const [take, setTake] = useState(11);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  const subscribers = rspc.useQuery([
    "subscriber.get_all", {
      skip: skip,
      take: take,
      name: search,
    }
  ]);

  const onPaginate = (forward?: boolean) => {
    const page = forward ? currentPage + 1 : currentPage - 1;
    setCurrentPage(page);

    if (forward) {
      setSkip(skip + take);
    } else {
      setSkip(skip - take);
    }
  };


  return (
    <>
      <DataTable
        filterColumn="name"
        Header={Header}
        columns={columns}
        onPaginate={onPaginate}
        currentPage={currentPage}
        searchValue={search}
        onSearch={(s) => {
          setSkip(0)
          setCurrentPage(0)
          setSearch(s)
        }}
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
