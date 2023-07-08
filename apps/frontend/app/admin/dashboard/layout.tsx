import React from "react";
import ClientLayout from "./_client";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => {
  return <ClientLayout>{props.children}</ClientLayout>;
};

export default Layout;
