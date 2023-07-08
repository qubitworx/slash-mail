"use client";

import Sidebar from "@/components/sidebar";
import { rspc } from "@/rspc/utils";
import Image from "next/image";

const ClientLayout = ({ children }: any) => {
  const data = rspc.useQuery(["user.authenticated"]);

  if (data.isLoading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Image src="/logo.png" width={56} height={56} alt="Logo" />
      </div>
    );
  }

  if (!data.data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <div className="bg-white-fill p-3 max-w-sm w-full rounded-lg">
          <h1 className="text-2xl font-medium">Error: Not Authenticated</h1>
          <p className="text-gray-500">
            You must be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <Sidebar />
      {children}
    </div>
  );
};

export default ClientLayout;
