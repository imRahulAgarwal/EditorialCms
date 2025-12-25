import { TCreateUser, TUpdateUser } from "@/types/User";
import axios from "axios";

export async function fetchUser(userId: string) {
	const url = `/api/users/${userId}`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}

export async function fetchUsers(params: Record<string, string | number | undefined>) {
	const query = new URLSearchParams(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, String(value)])
	).toString();
	const url = `/api/users?${query}`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}

export async function createUser(data: TCreateUser) {
	const url = `/api/users`;
	const response = await axios.post(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function updateUser(userId: string, data: TUpdateUser) {
	const url = `/api/users/${userId}`;
	const response = await axios.put(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function toggleActiveStatusUser(userId: string) {
	const url = `/api/users/${userId}/toggle`;
	const response = await axios.patch(url, JSON.stringify({}), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function deleteUser(userId: string) {
	const url = `/api/users/${userId}`;
	const response = await axios.delete(url, {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function resetUserPassword(userId: string) {
	const url = `/api/users/${userId}/reset-password`;
	const response = await axios.patch(url, JSON.stringify({}), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}
