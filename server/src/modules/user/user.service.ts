import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { startOfDay, subDays } from 'date-fns'
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto'
import { UserRepository } from '../repository/repositories'
import { User } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		protected userRepository: UserRepository
	) {}

	async getAll(): Promise<UserResponse[]> {
		return await this.userRepository
			.getAllWithRelations()
			.then(UserResponse.mapMulti)
	}

	async getById(id: string): Promise<UserResponse> {
		const user = await this.userRepository.getByIdWithRelations(id)

		if (!user) {
			throw new NotFoundException('User not found.')
		}

		return UserResponse.map(user)
	}

	async getByEmail(email: string): Promise<User> {
		return await this.userRepository.getByEmail(email)
	}

	async getProfile(id: string): Promise<UserResponse> {
		const profile = await this.getById(id)

		const totalTasks = profile.tasks.length
		// TODO: should get tasks from task service
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true
			}
		})

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		// TODO: should get tasks from task service
		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		})

		// TODO: should get tasks from task service
		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		})

		profile.statistics = [
			{ label: 'Total', value: totalTasks },
			{ label: 'Completed tasks', value: completedTasks },
			{ label: 'Today tasks', value: todayTasks },
			{ label: 'Week tasks', value: weekTasks }
		]

		return profile
	}

	async create(dto: CreateUserDto): Promise<UserResponse> {
		const hashedPassword = await hash(dto.password)

		return await this.userRepository
			.create({
				...dto,
				password: hashedPassword
			})
			.then(UserResponse.map)
	}

	async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
		const user = await this.getById(id)

		if (!user) {
			throw new NotFoundException('User not found.')
		}

		if (dto.password) {
			dto.password = await hash(dto.password)
		}

		return await this.userRepository.update(id, dto).then(UserResponse.map)
	}

	async delete(id: string): Promise<void> {
		const user = await this.getById(id)

		if (!user) {
			throw new NotFoundException('User not found.')
		}

		await this.userRepository.delete(id)
	}
}
