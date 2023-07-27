"use client";
import DashboardLayout from "@/layout/dashboard";
import { Users } from "ui/icons";
import Header from "./header";
import { useState } from "react";

const Subscribers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout icon={<Users size={20} />} name="Subscribers">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </DashboardLayout>
  );
};

export default Subscribers;
