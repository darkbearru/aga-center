export type TPhotoItem = {
	id?: number,
	path: string,
	title?: string,
	isDeleted?: boolean,
}
export type TPhotos = TPhotoItem[];

export type TFilesListItem = {
	name: string,
	file: File,
};
export type TFilesList = TFilesListItem[];

