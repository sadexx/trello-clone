import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto'
import { UserRepository } from '../repository/repositories'
import { User } from '@prisma/client'
import { TaskService } from '../task/task.service'

@Injectable()
export class UserService {
	constructor(
		protected userRepository: UserRepository,
		private taskService: TaskService
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

		const statistics = await this.taskService.getUserTaskStatistics(id)

		profile.statistics = [
			{ label: 'Total', value: statistics.totalTasks },
			{ label: 'Completed tasks', value: statistics.completedTasks },
			{ label: 'Today tasks', value: statistics.todayTasks },
			{ label: 'Week tasks', value: statistics.weekTasks }
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
