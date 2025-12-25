export interface IUser {
	fName: string;
	lName: string;
	fullName: string;
	username: string;
	email: string;
	role: "super_admin" | "admin" | "editor" | "viewer";
	isActive: boolean;
	isDeleted: boolean;
	password: string;
	passwordChangedAt?: Date;
	passwordResettedAt?: Date;
}
