import Joi from "joi";

const userSchema = Joi.object({
	fName: Joi.string().trim().required().messages({
		"string.base": "First Name is required.",
		"string.empty": "First Name is required.",
		"any.required": "First Name is required.",
	}),

	lName: Joi.string().trim().required().messages({
		"string.base": "Last Name is required.",
		"string.empty": "Last Name is required.",
		"any.required": "Last Name is required.",
	}),

	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			"string.base": "Email is required.",
			"string.empty": "Email is required.",
			"string.email": "Provide a valid Email.",
			"any.required": "Email is required.",
		}),

	role: Joi.string().valid("viewer", "editor", "admin").required().messages({
		"string.base": "Role must be either 'viewer/editor/admin'.",
		"string.empty": "Role must be either 'viewer/editor/admin'.",
		"any.required": "Role must be either 'viewer/editor/admin'.",
	}),
}).options({ abortEarly: false, allowUnknown: false });

export default userSchema;
