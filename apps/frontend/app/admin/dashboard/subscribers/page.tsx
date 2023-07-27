"use client";
import DashboardLayout from "@/layout/dashboard";
import { Users } from "ui/icons";
import Header from "./header";
import { useEffect, useState } from "react";
import List from "./list";

const Subscribers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [finalSearchQuery, setFinalSearchQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFinalSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <DashboardLayout icon={<Users size={20} />} name="Subscribers">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <List searchQuery={finalSearchQuery} />
    </DashboardLayout>
  );
};

export default Subscribers;
