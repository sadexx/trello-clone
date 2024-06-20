import { Injectable } from '@nestjs/common'
import { BaseRepository } from '../base'
import { TimeBlock } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TimeBlockRepository extends BaseRepository<TimeBlock> {
	constructor(protected readonly prisma: PrismaService) {
		super(prisma, 'timeBlock')
	}

	async getAllByUser(id: string): Promise<TimeBlock[]> {
		return await this.prisma.timeBlock.findMany({
			where: { userId: id },
			orderBy: {
				order: 'asc'
			}
		})
	}

	async updateOrder(ids: string[]): Promise<TimeBlock[]> {
		return await this.prisma.$transaction(
			ids.map((id, order) =>
				this.prisma.timeBlock.update({
					where: { id },
					data: { order }
				})
			)
		)
	}
}
