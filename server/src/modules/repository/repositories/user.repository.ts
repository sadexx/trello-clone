import { Injectable } from '@nestjs/common'
import { BaseRepository } from '../base'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserRepository extends BaseRepository<User> {
	private readonly allRelations = { tasks: true }

	constructor(protected readonly prisma: PrismaService) {
		super(prisma, 'user')
	}

	async getAllWithRelations(): Promise<User[]> {
		return await this.prisma.user.findMany({
			include: this.allRelations
		})
	}

	async getByIdWithRelations(id: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { id },
			include: this.allRelations
		})
	}

	async getByEmail(email: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { email }
		})
	}
}
