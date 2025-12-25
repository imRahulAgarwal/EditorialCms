import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TUserState = {
	name: string;
	email: string;
	role: string;
};

type TAuthState = {
	isLoggedIn: boolean;
	user: TUserState | null;
	requiresPasswordChange: boolean;
};

const initialState: TAuthState = {
	isLoggedIn: false,
	user: null,
	requiresPasswordChange: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (
			state,
			action: PayloadAction<{
				user: { name: string; email: string; role: string };
				requiresPasswordChange: boolean;
			}>
		) => {
			state.isLoggedIn = true;
			state.user = action.payload.user;
			state.requiresPasswordChange = action.payload.requiresPasswordChange;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.user = null;
		},
	},
});

export const { login: loginAction, logout: logoutAction } = userSlice.actions;
export default userSlice.reducer;
