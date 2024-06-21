import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class TimerRoundDto {
	@IsNumber()
	totalSeconds: number

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean
}
