import { Editor } from "@tiptap/core";
import { Dispatch, FC, SetStateAction } from "react";

import { BubbleMenuItem } from "./bubble-menu";
import { CaretDown, Check, Code, ListBullets, ListNumbers, Quotes, TextAa, TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight, TextH, TextHThree, TextHTwo } from "ui/icons";

interface NodeSelectorProps {
    editor: Editor;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const AlignmentSelector: FC<NodeSelectorProps> = ({
    editor,
    isOpen,
    setIsOpen,
}) => {
    const items: BubbleMenuItem[] = [
        {
            name: "Left",
            icon: TextAlignLeft,
            command: () =>
                editor.chain().focus().setTextAlign("left").run(),
            // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
            isActive: () => {
                return editor.isActive({
                    textAlign: "left",
                })
            }
        },
        {
            name: "Right",
            icon: TextAlignRight,
            command: () =>
                editor.chain().focus().setTextAlign("right").run(),
            isActive: () => {
                return editor.isActive({
                    textAlign: "right",
                })
            }
        },
        {
            name: "Center",
            icon: TextAlignCenter,
            command: () =>
                editor.chain().focus().setTextAlign("center").run(),
            isActive: () => {

                return editor.isActive({
                    textAlign: "center",
                })
            }
        },
        {
            name: "Justify",
            icon: TextAlignJustify,
            command: () =>
                editor.chain().focus().setTextAlign("justify").run(),
            isActive: () => {
                return editor.isActive({
                    textAlign: "justify",
                })
            }
        },
    ];

    const activeItem = items.filter((item) => item.isActive()).pop() ?? {
        name: "Left",
    };

    return (
        <div className="relative h-full">
            <button
                className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-base">
                    {activeItem.name}
                </span>
                <CaretDown className="h-4 w-4" />
            </button>

            {isOpen && (
                <section className="fixed top-full z-[99999] mt-1 flex w-48 flex-col overflow-hidden rounded border border-stone-200 bg-white-fill p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.command();
                                setIsOpen(false);
                            }}
                            className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
                        >
                            <div className="flex items-center space-x-2">
                                <div className="rounded-sm border border-stone-200 p-1">
                                    <item.icon className="h-3 w-3" />
                                </div>
                                <span>{item.name}</span>

                            </div>
                            {activeItem.name === item.name && <Check className="h-4 w-4" />}
                        </button>
                    ))}
                </section>
            )}
        </div>
    );
};
