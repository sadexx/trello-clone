import { TimerRound } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator'

export class TimerRoundResponseDto {
	@IsString()
	@Expose()
	id: string

	@IsNumber()
	@Expose()
	totalSeconds: number

	@IsBoolean()
	@Expose()
	isCompleted: boolean

	@IsDate()
	@Expose()
	createdAt: Date

	static map(data: TimerRound): TimerRoundResponseDto {
		return plainToClass(TimerRoundResponseDto, data, {
			excludeExtraneousValues: true
		})
	}

	static mapMulti(data: TimerRound[]): TimerRoundResponseDto[] {
		return data.map(TimerRoundResponseDto.map)
	}
}
