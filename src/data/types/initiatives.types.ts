export type TInitiativeTypes = {
	id?: number,
	name: string,
	count?: number,
	countStr?: string
}

export type TInitiativeTypesResponse = {
	errors?: {
		name?: string,
		other?: string,
	}
	type: TInitiativeTypes,
}