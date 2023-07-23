"use client";
import DashboardLayout from "@/layout/dashboard";
import { List } from "ui/icons";
import Header from "./header";
import Helper from "@/components/helper";
import { rspc } from "@/rspc/utils";
import dayjs from "dayjs";
import RowActions from "./row-actions";
import { useMemo, useState } from "react";

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
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="rounded-lg overflow-hidden border-2 border-white-stroke">
        <table className="w-full text-sm text-left table-auto">
          <thead className="text-xs text-black uppercase bg-white-fill">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="border-white-stroke border-t-2">
            {final_list.map((list, idx) => (
              <tr
                className={`bg-white ${
                  idx % 2 === 0 ? "bg-white-fill" : "bg-white-stroke/20"
                } ${
                  idx === final_list.length - 1
                    ? ""
                    : "border-b-2 border-white-stroke"
                }`}
                key={idx}
              >
                <th className="px-6 py-3" scope="row">
                  {list.name}
                </th>
                <td className="px-6 py-4">
                  {dayjs(list.created_at).format("DD MMM YYYY")}
                </td>
                <td className="px-6 py-4">
                  {dayjs(list.updated_at).format("DD MMM YYYY")}
                </td>
                <td className="px-6 py-2">
                  <RowActions {...list} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Helper text="Lists are groups of subscribers who are interested on a common topic. You can create a list and add subscribers to it. Further you can send campaigns to these lists." />
    </DashboardLayout>
  );
};

export default Lists;
