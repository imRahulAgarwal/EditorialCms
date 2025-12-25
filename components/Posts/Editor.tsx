"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type TipTapEditorProps = {
	value: string;
	onChange: (html: string) => void;
};

function ToolbarButton({
	children,
	onClick,
	active,
	label,
}: {
	children: React.ReactNode;
	onClick: () => void;
	active?: boolean;
	label: string;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className={`h-8 min-w-8 rounded-sm border px-2 text-xs font-medium
				${active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}
				focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
			{children}
		</button>
	);
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
	const editor = useEditor({
		extensions: [StarterKit],
		editorProps: {
			attributes: {
				class: "max-w-none min-h-37.5 rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mt-2 w-full",
			},
		},
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor) {
			editor.commands.setContent(value);
		}
	}, [editor, value]);

	if (!editor) return null;

	return (
		<div className="w-full flex flex-col gap-2">
			{/* Toolbar */}
			<div className="flex flex-wrap gap-1 rounded-sm border border-gray-300 bg-gray-50 p-1 ">
				<ToolbarButton
					label="Bold"
					active={editor.isActive("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}>
					B
				</ToolbarButton>

				<ToolbarButton
					label="Italic"
					active={editor.isActive("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}>
					I
				</ToolbarButton>

				<ToolbarButton
					label="Strike"
					active={editor.isActive("strike")}
					onClick={() => editor.chain().focus().toggleStrike().run()}>
					S
				</ToolbarButton>

				<ToolbarButton
					label="Heading"
					active={editor.isActive("heading", { level: 2 })}
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
					H2
				</ToolbarButton>

				<ToolbarButton
					label="Bullet List"
					active={editor.isActive("bulletList")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}>
					UL
				</ToolbarButton>

				<ToolbarButton
					label="Ordered List"
					active={editor.isActive("orderedList")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}>
					OL
				</ToolbarButton>
			</div>
			<div className="w-full">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
