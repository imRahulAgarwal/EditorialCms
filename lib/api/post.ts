import { TPost } from "@/types/Post";
import axios from "axios";

export async function fetchPost(postId: string) {
	const url = `/api/posts/${postId}`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}

export async function fetchPosts(params: Record<string, string | number | undefined>) {
	const query = new URLSearchParams(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, String(value)])
	).toString();
	const url = `/api/posts?${query}`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}

export async function createPost(data: TPost) {
	const url = `/api/posts`;
	const response = await axios.post(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function updatePost(postId: string, data: TPost) {
	const url = `/api/posts/${postId}`;
	const response = await axios.put(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function updatePostStatus(postId: string, publishStatus: string) {
	const url = `/api/posts/${postId}/status`;
	const response = await axios.patch(url, JSON.stringify({ publishStatus }), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function deletePost(postId: string) {
	const url = `/api/posts/${postId}`;
	const response = await axios.delete(url, { withCredentials: true });
	return response.data;
}
