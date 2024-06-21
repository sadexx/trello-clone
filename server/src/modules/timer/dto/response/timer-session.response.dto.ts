import { TimerSession } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsString } from 'class-validator'
import { TimerRoundResponseDto } from './timer-round.response.dto'

export class TimerSessionResponseDto {
	@IsString()
	@Expose()
	id: string

	@IsBoolean()
	@Expose()
	isCompleted: boolean

	@IsString()
	@Expose()
	userId: boolean

	@IsArray()
	@Expose()
	rounds: TimerRoundResponseDto[]

	@IsDate()
	@Expose()
	createdAt: Date

	static map(data: TimerSession): TimerSessionResponseDto {
		return plainToClass(TimerSessionResponseDto, data, {
			excludeExtraneousValues: true
		})
	}

	static mapMulti(data: TimerSession[]): TimerSessionResponseDto[] {
		return data.map(TimerSessionResponseDto.map)
	}
}
