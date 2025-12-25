import PostForm from "@/components/Posts/PostForm";

export default function NewPost() {
	return (
		<div className="flex-1">
			<h1 className="mb-4 text-lg font-semibold text-gray-900">Create Post</h1>
			<PostForm />
		</div>
	);
}
