"use client";

import { useEffect, useState } from "react";
import TipTapEditor from "./Editor";
import { createPost, updatePost, fetchPost } from "@/lib/api/post";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PostForm({ postId }: { postId?: string }) {
	const [title, setTitle] = useState("");
	const [htmlContent, setHtmlContent] = useState("<p></p>");

	const router = useRouter();

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = { title, htmlContent };
		if (postId) {
			updatePost(postId, formData).then((result) => {
				toast.success(result.message);
				router.replace("/posts");
			});
		} else {
			createPost(formData).then((result) => {
				toast.success(result.message);
				router.replace("/posts");
			});
		}
	};

	useEffect(() => {
		if (postId) {
			fetchPost(postId).then((result) => {
				if (result.success) {
					setTitle(result.post.title);
					setHtmlContent(result.post.htmlContent);
				}
			});
		}
	}, [postId]);

	return (
		<form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
			<div className="flex flex-col gap-1">
				<label htmlFor="" className="text-sm font-medium text-gray-700">
					Title
				</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="h-9 rounded-sm border border-gray-300 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium text-gray-700">Post Content</label>
				<TipTapEditor value={htmlContent} onChange={setHtmlContent} />
			</div>

			<button
				type="submit"
				className="self-end h-9 rounded-sm bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
				Submit
			</button>
		</form>
	);
}
