import type { IPhotosRepository } from '~/src/data/photos.repository.interface';
import type { TPhotos, TPhotoItem } from '~/src/data/types/photos';
import { prismaClient } from '~/src/utils/prismaClient';

export class PhotosRepository implements IPhotosRepository {
	async deletePhotos(photos: TPhotos): Promise<void> {
		if (!photos.length) return;

		const idList: number[] = [];
		let where;
		photos.forEach((item: TPhotoItem) => {
			if (item.id) idList.push(item.id);
		});
		where = { id: { in: idList } }
		console.log('deletePhotos', where);

		try {
			await prismaClient.photos.deleteMany({ where });
		} catch (e) {
			console.log(e);
		}
	}
}