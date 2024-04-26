import { User } from '@prisma/client'
import { Expose, plainToClass } from 'class-transformer'
import { IsArray, IsNumber, IsString } from 'class-validator'

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

	static map(data: User): UserResponse {
		const user = plainToClass(UserResponse, data, {
			excludeExtraneousValues: true
		})

		return user
	}

	static mapMulti(data: User[]): UserResponse[] {
		return data.map(UserResponse.map)
	}
}
