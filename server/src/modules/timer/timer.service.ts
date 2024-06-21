import { Injectable, NotFoundException } from '@nestjs/common'
import { TimerRoundDto } from './dto/request/timer-round.request.dto'
import { TimerRepository } from '../repository/repositories'
import { UserService } from '../user/user.service'
import {
	TimerRoundResponseDto,
	TimerSessionDto,
	TimerSessionResponseDto
} from './dto'

@Injectable()
export class TimerService {
	constructor(
		private readonly timerRepository: TimerRepository,
		private readonly userService: UserService
	) {}

	async getTodaySession(userId: string): Promise<TimerSessionResponseDto> {
		return await this.timerRepository
			.getTodaySession(userId)
			.then(TimerSessionResponseDto.map)
	}

	async create(userId: string): Promise<TimerSessionResponseDto> {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession

		const user = await this.userService.getById(userId)

		if (!user) throw new NotFoundException('User not found.')

		return await this.timerRepository
			.create(userId, user.intervalsCount)
			.then(TimerSessionResponseDto.map)
	}

	async update(
		dto: TimerSessionDto,
		id: string,
		userId: string
	): Promise<TimerSessionResponseDto> {
		return await this.timerRepository
			.update(dto, id, userId)
			.then(TimerSessionResponseDto.map)
	}

	async updateRound(
		dto: TimerRoundDto,
		id: string
	): Promise<TimerRoundResponseDto> {
		return await this.timerRepository
			.updateRound(dto, id)
			.then(TimerRoundResponseDto.map)
	}

	async delete(id: string, userId: string): Promise<void> {
		await this.timerRepository.delete(id, userId)
	}
}
