export type TEmail = {
	to: string,
	from: string,
	subject: string,
	text: string,
	html?: string;
}

export type TEmailResponse =  {
	message: string,
	error?: Error
}