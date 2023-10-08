export type TInitiativeTypes = {
	id?: number,
	name: string,
}

export type TInitiativeTypesResponse = {
	errors?: {
		name?: string,
		other?: string,
	}
	type: TInitiativeTypes,
}