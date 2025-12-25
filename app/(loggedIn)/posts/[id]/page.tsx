"use client";

import { fetchPost } from "@/lib/api/post";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type TPost = {
	title?: string;
	htmlContent?: string;
	createdAt?: Date;
	_id: string;
};

export default function ViewPost() {
	const [post, setPost] = useState<TPost | null>(null);
	const params = useParams();
	const id = params.id as string;

	useEffect(() => {
		if (!id) return;

		fetchPost(id).then((result) => {
			if (result.success) {
				setPost(result.post);
			}
		});
	}, [id]);

	if (!post) {
		return (
			<div className="bg-white border border-slate-200 rounded-md p-6">
				<p className="text-sm text-slate-500">Post not found</p>
			</div>
		);
	}

	return (
		<div className="bg-white border border-slate-200 rounded-md p-6">
			{/* Title */}
			<h1 className="text-xl font-semibold text-slate-700">{post.title || "Untitled"}</h1>

			{/* Metadata */}
			{post.createdAt && (
				<p className="mt-1 text-sm text-slate-500">{dayjs(post.createdAt).format("DD-MMM-YYYY")}</p>
			)}

			<hr className="my-6 border-slate-200" />

			{/* Content */}
			<div
				className="prose max-w-none text-slate-900 leading-relaxed"
				dangerouslySetInnerHTML={{
					__html: post.htmlContent || "<p>No content available.</p>",
				}}
			/>
		</div>
	);
}
