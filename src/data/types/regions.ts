export type TRegion = {
	id?: number,
	name: string,
	slug: string,
	isActive: boolean,
}

export type TRegionResponse = {
	errors?: {
		name?: string,
		slug?: string,
		other?: string
	}
	region: TRegion,
}