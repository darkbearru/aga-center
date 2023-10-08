import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
	// Добавление пользователя по-умолчанию
	await prisma.users.create({
		data: {
			email: 'a.abramenko.chita.ru@gmail.com',
			fio: 'Абраменко Алексей',
			isAdmin: true,
			isModerator: true,
			confirmCode: '',
		},
	});
	// Добавление региона по-умолчанию
	await prisma.regions.create({
		data: {
			name: 'Агинск',
			slug: 'aginsk',
			isActive: true,
		},
	});
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	});