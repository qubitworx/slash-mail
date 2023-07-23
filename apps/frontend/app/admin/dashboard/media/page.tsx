"use client";
import DashboardLayout from "@/layout/dashboard";
import { Image } from "ui/icons";
import Header from "./header";
import { useState } from "react";

const Media = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout name="Media" icon={<Image />}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </DashboardLayout>
  );
};

export default Media;
