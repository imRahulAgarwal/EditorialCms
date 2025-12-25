"use client";

import { Provider } from "react-redux";
import { store } from "../index";

export default function UserProvider({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
