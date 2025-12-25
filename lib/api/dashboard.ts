import axios from "axios";

export async function fetchKpiCardData(params: Record<string, string>) {
	const query = new URLSearchParams(params).toString();
	const url = `/api/dashboard?${query}`;
	const response = await axios.get(url, { withCredentials: true });
	return response.data;
}
