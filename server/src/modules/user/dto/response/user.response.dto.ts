import { User } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator'

export class StatisticsResponse {
	@IsString()
	label: string

	@IsNumber()
	value: number
}

export class UserResponse {
	@IsString()
	@Expose()
	id: string

	@IsString()
	@Expose()
	email: string

	@IsString()
	@Expose()
	name: string

	@IsArray()
	@Expose()
	tasks: string[]

	@IsArray()
	@Expose()
	statistics: StatisticsResponse[]

	@IsDate()
	@Expose()
	createdAt: Date

	static map(data: User): UserResponse {
		return plainToClass(UserResponse, data, {
			excludeExtraneousValues: true
		})
	}

	static mapMulti(data: User[]): UserResponse[] {
		return data.map(UserResponse.map)
	}
}
