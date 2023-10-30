export function numberSuffix(number: number, word: string, suffixOne: string, suffixTwo: string, suffixFive: string): string {
	const strNumber = number.toString();
	const numbers: string[] = strNumber.split('');
	const lastNumber = Number(numbers.slice(-1));
	const lastNumberTwo = strNumber.length > 1 ? Number(numbers.slice(-2)[0]) : 0;
	let result: string = `${strNumber} ${word}`;
	if (lastNumberTwo === 1) return `${result}${suffixFive}`;
	switch(lastNumber) {
		case 1: {
			result += suffixOne;
			break;
		}
		case 2 :
		case 3 :
		case 4 : {
			result += lastNumberTwo !== 1 ? suffixTwo : suffixFive;
			break;
		}
		default: result += suffixFive;
	}
	return result;
}