import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			"string.base": "Email is required.",
			"string.empty": "Email is required.",
			"any.required": "Email is required.",
		}),

	password: Joi.string().min(8).trim().required().messages({
		"string.base": "Password is required.",
		"string.empty": "Password is required.",
		"string.min": "Password must be at least 8 characters.",
		"any.required": "Password is required.",
	}),
});

export const changePasswordSchema = Joi.object({
	currentPassword: Joi.string().min(8).trim().required().messages({
		"string.base": "Current Password is required.",
		"string.empty": "Current Password is required.",
		"string.min": "Current Password must be at least 8 characters.",
		"any.required": "Current Password is required.",
	}),

	newPassword: Joi.string().min(8).trim().required().messages({
		"string.base": "New Password is required.",
		"string.empty": "New Password is required.",
		"string.min": "New Password must be at least 8 characters.",
		"any.required": "New Password is required.",
	}),

	confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")).messages({
		"any.only": "Confirm password must match new password.",
		"any.required": "Confirm password is required.",
	}),
}).options({ abortEarly: false });
