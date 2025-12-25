"use client";

import PostForm from "@/components/Posts/PostForm";
import { useParams } from "next/navigation";

export default function UpdatePost() {
	const params = useParams();
	const postId = params.id as string;

	return (
		<div className="flex-1">
			<h1 className="mb-4 text-lg font-semibold text-gray-900">Update Post</h1>
			<PostForm postId={postId} />
		</div>
	);
}
