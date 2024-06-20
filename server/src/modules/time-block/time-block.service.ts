import { Injectable, NotFoundException } from '@nestjs/common'
import {
	CreateTimeBlockDto,
	TimeBlockResponse,
	UpdateTimeBlockDto
} from './dto'
import { TimeBlockRepository } from '../repository/repositories'

@Injectable()
export class TimeBlockService {
	constructor(protected timeBlockRepository: TimeBlockRepository) {}

	async getAll(): Promise<TimeBlockResponse[]> {
		return await this.timeBlockRepository
			.findAll()
			.then(TimeBlockResponse.mapMulti)
	}

	async getById(id: string): Promise<TimeBlockResponse> {
		const timeBlock = await this.timeBlockRepository.findById(id)

		if (!timeBlock) {
			throw new NotFoundException('Time-block not found.')
		}

		return TimeBlockResponse.map(timeBlock)
	}

	async getAllByUser(id: string): Promise<TimeBlockResponse[]> {
		return await this.timeBlockRepository
			.getAllByUser(id)
			.then(TimeBlockResponse.mapMulti)
	}

	async create(
		dto: CreateTimeBlockDto,
		userId: string
	): Promise<TimeBlockResponse> {
		return await this.timeBlockRepository
			.create({
				...dto,
				userId
			})
			.then(TimeBlockResponse.map)
	}

	async update(
		id: string,
		dto: UpdateTimeBlockDto
	): Promise<TimeBlockResponse> {
		return await this.timeBlockRepository
			.update(id, dto)
			.then(TimeBlockResponse.map)
	}

	async delete(id: string): Promise<void> {
		await this.timeBlockRepository.delete(id)
	}

	async updateOrder(ids: string[]): Promise<TimeBlockResponse[]> {
		return await this.timeBlockRepository.updateOrder(ids)
	}
}
