import { TChangePassword, TLogin } from "@/types/Auth";
import axios from "axios";

export async function login(data: TLogin) {
	const url = `/api/auth/login`;
	const response = await axios.post(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}

export async function profile() {
	const url = `/api/auth/profile`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}

export async function changePassword(data: TChangePassword) {
	const url = `/api/auth/change-password`;
	const response = await axios.post(url, JSON.stringify(data), {
		withCredentials: true,
		headers: { "Content-Type": "application/json" },
	});
	return response.data;
}
