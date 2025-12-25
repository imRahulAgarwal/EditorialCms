"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../slices/userSlice";
import axios from "axios";

export default function AuthInitializer() {
	const dispatch = useDispatch();

	useEffect(() => {
		const getMyDetails = async () => {
			try {
				const response = await axios.get("/api/auth/profile", { withCredentials: true });
				const data = response.data;

				dispatch(loginAction(data));
			} catch {}
		};

		getMyDetails();
	}, [dispatch]);

	return null;
}
