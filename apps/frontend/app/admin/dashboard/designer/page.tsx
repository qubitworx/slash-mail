"use client";
import React, { useRef } from "react";

import EmailEditor from "react-email-editor";

const App = (props: any) => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    // @ts-ignore
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onReady = () => {
    // editor is ready
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  return (
    <EmailEditor minHeight={"100vh"} ref={emailEditorRef} onReady={onReady} />
  );
};

export default App;
