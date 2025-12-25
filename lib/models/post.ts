import { Schema, model, models } from "mongoose";

const postSchema = new Schema(
	{
		title: String,
		htmlContent: String,
		publishStatus: { type: String, enum: ["draft", "archived", "published"], default: "draft" },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const PostModel = models.posts || model("posts",postSchema);

export default PostModel;
