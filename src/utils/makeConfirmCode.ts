export const makeConfirmCode = (min: number = 10000000, max: number = 99999999): string => {
	return String(Math.floor(Math.random() * (max - min) + min));
}
