import { Priority, Task } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator'

export class TaskResponse {
	@IsString()
	@Expose()
	id: string

	@IsString()
	@Expose()
	name: string

	@IsEnum(Priority)
	@Expose()
	priority: Priority

	@IsBoolean()
	@Expose()
	isCompleted: boolean

	@IsString()
	@Expose()
	userId: string

	@IsDate()
	@Expose()
	createdAt: Date

	static map(data: Task): TaskResponse {
		return plainToClass(TaskResponse, data, {
			excludeExtraneousValues: true
		})
	}

	static mapMulti(data: Task[]): TaskResponse[] {
		return data.map(TaskResponse.map)
	}
}
