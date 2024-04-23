import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto'
import {
	EXPIRE_DAY_REFRESH_TOKEN,
	REFRESH_TOKEN_NAME
} from 'src/common/constants'
import { cookieConfig } from 'src/config'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: AuthDto): Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validate(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto): Promise<any> {
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

	async getNewTokens(req: Request, res: Response): Promise<any> {
		const refreshToken = req.cookies[REFRESH_TOKEN_NAME]

		if (!refreshToken) {
			this.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException()
		}

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

	private async issueTokens(
		userId: string
	): Promise<{ accessToken: string; refreshToken: string }> {
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

	private async validate(dto: AuthDto): Promise<any> {
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

	async addRefreshTokenToResponse(
		res: Response,
		refreshToken: string
	): Promise<void> {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
			...cookieConfig,
			expires: expiresIn
		})
	}

	async removeRefreshTokenFromResponse(res: Response): Promise<void> {
		res.cookie(REFRESH_TOKEN_NAME, '', {
			...cookieConfig,
			expires: new Date()
		})
	}
}
