export type TReadUser = {
	_id: string;
	fName: string;
	lName: string;
	fullName: string;
	email: string;
	role: "super_admin" | "admin" | "editor" | "viewer";
	createdAt: Date;
	isActive: boolean;
};

export type TCreateUser = {
	fName: string;
	lName: string;
	email: string;
	role: "admin" | "editor" | "viewer";
};

export type TUpdateUser = {
	fName: string;
	lName: string;
	email: string;
	role: "admin" | "editor" | "viewer";
};
