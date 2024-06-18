import { Injectable } from '@nestjs/common'
import { BaseRepository } from '../base'
import { Task } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
	constructor(protected readonly prisma: PrismaService) {
		super(prisma, 'task')
	}

	async getAllByUser(id: string): Promise<Task[]> {
		return await this.prisma.task.findMany({
			where: { userId: id }
		})
	}
}
