import sanitizeHtml from "sanitize-html";

export default function sanitizeHtmlUtil(dirtyHtml: string) {
	return sanitizeHtml(dirtyHtml);
}
