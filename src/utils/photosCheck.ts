import type { TFilesList, TFilesListItem } from '~/src/data/types/photos';
export default function photosCheck(photosList: TFilesList, currentCount?: number, maxPhotos: number = 3, maxSize: number = 3145728): TFilesList {
	maxPhotos-= currentCount || 0;
	if (maxPhotos <= 0) return [];
	const result: TFilesList = [];
	photosList.forEach((item: TFilesListItem) => {
		if ((item.file.size < maxSize) && (result.length < maxPhotos)) {
			result.push({...item});
		}
	});
	return result;
}