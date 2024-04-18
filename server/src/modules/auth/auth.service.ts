import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto'

@Injectable()
export class AuthService {
	// TODO: put constants to separate file
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validate(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) {
			throw new BadRequestException('User with this email already exists.')
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)

		if (!result) {
			throw new UnauthorizedException('Invalid refresh token.')
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)

		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private async issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return {
			accessToken,
			refreshToken
		}
	}

	private async validate(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) {
			throw new NotFoundException('User not found.')
		}

		const isValid = await verify(user.password, dto.password)

		if (!isValid) {
			throw new UnauthorizedException('Invalid email or password.')
		}

		return user
	}

	async addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			// TODO: put domain in env
			domain: 'localhost',
			expires: expiresIn,
			secure: true,
			sameSite: 'lax'
		})
	}

	async removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			// TODO: put domain in env
			domain: 'localhost',
			expires: new Date(),
			secure: true,
			sameSite: 'lax'
		})
	}
}
