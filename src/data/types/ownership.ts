export type TOwnership = {
	id?: number,
	nameShort: string,
	nameFull: string,
}

export type TOwnershipResponse = {
	errors?: {
		nameShort?: string,
		nameFull?: string,
		other?: string,
	}
	ownership: TOwnership,
}