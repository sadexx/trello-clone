import { IsOptional, IsString } from 'class-validator'

export class TokenResponse {
	@IsString()
	accessToken: string

	@IsString()
	@IsOptional()
	refreshToken?: string
}
