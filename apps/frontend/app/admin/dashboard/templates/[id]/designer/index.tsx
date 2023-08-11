import { Template } from "@/rspc/bindings"
import { useRef } from "react";
import { EditorRef, EmailEditor, Design } from "react-email-editor"
import { Button } from "ui";

interface Props {
    template: Template
}

const EmailDesigner = (props: Props) => {
    const emailEditorRef = useRef<EditorRef>(null);


    const exportHtml = () => {
        // @ts-ignore
        emailEditorRef.current!.editor.exportHtml((data: { design: Design, html: string }) => {
            const { design, html } = data;
            console.log("exportHtml", html);
            console.log("exportHtml", JSON.stringify(design));
        })
    }

    const onReady = () => {
        emailEditorRef.current!.loadDesign(JSON.parse(props.template.json))
    }

    return (
        <div>
            <Button onClick={exportHtml}>Export HTML</Button>

            <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </div>
    )
}

export default EmailDesigner