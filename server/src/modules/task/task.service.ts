import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto, TaskResponse, UpdateTaskDto } from './dto'
import { TaskRepository } from '../repository/repositories'
import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class TaskService {
	constructor(protected taskRepository: TaskRepository) {}

	async getAll(): Promise<TaskResponse[]> {
		return await this.taskRepository.findAll().then(TaskResponse.mapMulti)
	}

	async getById(id: string): Promise<TaskResponse> {
		const task = await this.taskRepository.findById(id)

		if (!task) {
			throw new NotFoundException('Task not found.')
		}

		return TaskResponse.map(task)
	}

	async getAllByUser(id: string): Promise<TaskResponse[]> {
		return await this.taskRepository
			.getAllByUser(id)
			.then(TaskResponse.mapMulti)
	}

	async create(dto: CreateTaskDto, userId: string): Promise<TaskResponse> {
		return await this.taskRepository
			.create({
				...dto,
				userId
			})
			.then(TaskResponse.map)
	}

	async update(id: string, dto: UpdateTaskDto): Promise<TaskResponse> {
		return await this.taskRepository.update(id, dto).then(TaskResponse.map)
	}

	async delete(id: string): Promise<void> {
		await this.taskRepository.delete(id)
	}

	async getUserTaskStatistics(
		userId: string
	): Promise<{ [key: string]: number }> {
		const tasks = await this.getAllByUser(userId)

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		let totalTasks = 0
		let completedTasks = 0
		let todayTasks = 0
		let weekTasks = 0

		for (const task of tasks) {
			totalTasks++
			if (task.isCompleted) {
				completedTasks++
			}
			const createdAt = new Date(task.createdAt)
			if (createdAt >= todayStart) {
				todayTasks++
			}
			if (createdAt >= weekStart) {
				weekTasks++
			}
		}

		return {
			totalTasks,
			completedTasks,
			todayTasks,
			weekTasks
		}
	}
}
