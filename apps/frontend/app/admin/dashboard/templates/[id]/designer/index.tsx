import { Template } from "@/rspc/bindings"
import { useRef } from "react";
import { EditorRef, EmailEditor, Design } from "react-email-editor"
import { Button } from "ui";

interface Props {
    template: Template
    setTemplate: (template: Template) => void
}

const EmailDesigner = (props: Props) => {
    const emailEditorRef = useRef<EditorRef>(null);

    const exportHtml = () => {
        // @ts-ignore
        emailEditorRef.current!.editor.exportHtml((data: { design: Design, html: string }) => {
            const { design, html } = data;
            props.setTemplate({
                ...props.template,
                json: JSON.stringify(design),
                content: html
            })
        })
    }

    const onReady = () => {
        emailEditorRef.current!.loadDesign(JSON.parse(props.template.json))
    }

    return (
        <div>
            <Button
                variant={"secondary"}
                onClick={exportHtml}>
                Save
            </Button>

            <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </div>
    )
}

export default EmailDesigner