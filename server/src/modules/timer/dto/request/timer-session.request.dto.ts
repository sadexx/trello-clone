import { IsBoolean, IsOptional } from 'class-validator'

export class TimerSessionDto {
	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean
}
