import { Injectable } from '@nestjs/common'
import { TimerRound, TimerSession } from '@prisma/client'
import { TimerRoundDto, TimerSessionDto } from 'src/modules/timer/dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TimerRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getTodaySession(userId: string): Promise<TimerSession> {
		const today = new Date().toISOString().split('T')[0]

		return await this.prisma.timerSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				rounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string, intervalsCount: number): Promise<TimerSession> {
		return await this.prisma.timerSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: intervalsCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				rounds: true
			}
		})
	}

	async update(
		dto: TimerSessionDto,
		id: string,
		userId: string
	): Promise<TimerSession> {
		return await this.prisma.timerSession.update({
			where: {
				userId,
				id
			},
			data: dto
		})
	}

	async updateRound(dto: TimerRoundDto, id: string): Promise<TimerRound> {
		return await this.prisma.timerRound.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: string, userId: string): Promise<void> {
		await this.prisma.timerSession.delete({
			where: {
				id,
				userId
			}
		})
	}
}
