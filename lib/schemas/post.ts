import Joi from "joi";

/**
 * Disallowed HTML tags (media-related)
 */
const forbiddenHtmlTags = /<\/?(img|video|audio|iframe|object|embed|source|picture|track|canvas|svg)[^>]*>/i;

export const postSchema = Joi.object({
	title: Joi.string().trim().required().messages({
		"string.base": "Title is required.",
		"string.empty": "Title is required.",
		"string.min": "Title must be at least 3 characters.",
		"any.required": "Title is required.",
	}),

	htmlContent: Joi.string()
		.pattern(new RegExp(`^(?!.*${forbiddenHtmlTags.source}).*$`, "i"))
		.required()
		.messages({
			"string.base": "Content is required.",
			"string.empty": "Content is required.",
			"string.pattern.base":
				"Content may contain text only. Media elements (image, video, audio) are not allowed.",
			"any.required": "Content is required.",
		}),
}).options({ abortEarly: false, allowUnknown: false });
