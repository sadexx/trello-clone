import { PrismaService } from 'src/prisma.service'

export abstract class BaseRepository<T> {
	constructor(
		protected readonly prisma: PrismaService,
		protected readonly model: string
	) {}

	async findAll(): Promise<T[]> {
		return this.prisma[this.model].findMany()
	}

	async findById(id: string): Promise<T> {
		return this.prisma[this.model].findUnique({ where: { id } })
	}

	async create(data: Partial<T>): Promise<T> {
		return this.prisma[this.model].create({ data })
	}

	async update(id: string, data: Partial<T>): Promise<T> {
		return this.prisma[this.model].update({ where: { id }, data })
	}

	async delete(id: string): Promise<T> {
		return this.prisma[this.model].delete({ where: { id } })
	}
}
