"use client";
import DashboardLayout from "@/layout/dashboard";
import { Users } from "ui/icons";
import List from "./list";

const Subscribers = () => {
  return (
    <DashboardLayout icon={<Users size={20} />} name="Subscribers">
      <List />
    </DashboardLayout>
  );
};

export default Subscribers;
