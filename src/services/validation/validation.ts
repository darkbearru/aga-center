export function emailValidate(email: string): boolean {
	return !!email.match(/^(([-\w_]+\.?)+)@(([-\w_]+\.)+)(com|ru|net|\w+)$/im);

}
export function codeValidate(code: string): boolean {
	return !!code.match(/^\d{8}$/im);

}