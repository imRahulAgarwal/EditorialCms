export type TLogin = {
	email: string;
	password: string;
};

export type TChangePassword = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};
