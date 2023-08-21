'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { lowlight } from 'lowlight'
import { EditorBubbleMenu } from './bubble-menu'
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from '@tiptap/extension-highlight'
import SlashCommand from './slash-command'
import TiptapImage from "@tiptap/extension-image";
import TextAlign from '@tiptap/extension-text-align'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Link.configure({
                linkOnPaste: true,
                openOnClick: false
            }),
            CodeBlockLowlight.configure({
                lowlight: lowlight
            }),
            TiptapImage,
            TaskList,
            TiptapUnderline,
            TextStyle,
            Color,
            SlashCommand,
            TaskItem,
            TextAlign.configure({
                alignments: ['left', 'center', 'right', 'justify'],
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Placeholder.configure({
                placeholder: "Start drafting your email in Markdown. Click on Slash (`/`) key to see available commands.",
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: '',
    })

    return (
        <div onClick={() => {
            editor?.chain().focus().run();
        }} className='overflow-auto max-h-[80vh]'>
            {editor && <EditorBubbleMenu editor={editor} />}
            <EditorContent
                className='min-h-[80vh] p-4 border rounded-xl'
                editor={editor} />
        </div>
    )
}

export default Tiptap