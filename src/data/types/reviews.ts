import { TInitiative } from '~/src/data/types/initiatives';

export type TReviews = {
	id?: number,
	title: string,
	review: string,
	rate?: number,
	initiative?: TInitiative,
}
/*
    id           Int         @id @default(autoincrement())
    Initiative   Initiative? @relation(fields: [initiativeId], references: [id])
    initiativeId Int?
    title        String?
    review       String?     @db.Text
    rate         Int?        @default(0)
    client       Client?     @relation(fields: [clientId], references: [id])
    clientId     Int?

*/