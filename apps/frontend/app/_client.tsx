"use client";

import { client, queryClient, rspc } from "@/rspc/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "ui/toast";

const ClientLayout = ({ children }: any) => {
  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <>
        <Toaster position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
        <div className="w-screen h-screen">{children}</div>
      </>
    </rspc.Provider>
  );
};

export default ClientLayout;
