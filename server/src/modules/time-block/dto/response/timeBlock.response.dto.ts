import { TimeBlock } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class TimeBlockResponse {
	@IsString()
	@Expose()
	id: string

	@IsString()
	@Expose()
	name: string

	@IsString()
	@Expose()
	color: string

	@IsNumber()
	@Expose()
	duration: number

	@IsNumber()
	@Expose()
	order: number

	@IsString()
	@Expose()
	userId: string

	@IsDate()
	@Expose()
	createdAt: Date

	static map(data: TimeBlock): TimeBlockResponse {
		return plainToClass(TimeBlockResponse, data, {
			excludeExtraneousValues: true
		})
	}

	static mapMulti(data: TimeBlock[]): TimeBlockResponse[] {
		return data.map(TimeBlockResponse.map)
	}
}
