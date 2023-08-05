"use client";
import DashboardLayout from "@/layout/dashboard";
import React, { useRef } from "react";

import EmailEditor from "react-email-editor";
import { PaintBrush } from "ui/icons";

const App = (props: any) => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    // @ts-ignore
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
      console.log("exportHtml", design);
    });
  };

  const onReady = () => {};

  return (
    <DashboardLayout name="Designer" icon={<PaintBrush />}>
      <EmailEditor minHeight={"90vh"} ref={emailEditorRef} onReady={onReady} />
    </DashboardLayout>
  );
};

export default App;
