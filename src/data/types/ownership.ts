export type TOwnership = {
	id?: number,
	nameShort: string,
	nameFull: string,
	createdAt?: Date,
	changedAt?: Date
}

export type TOwnershipResponse = {
	errors?: {
		nameShort?: string,
		nameFull?: string,
		other?: string,
	}
	ownership: TOwnership,
}