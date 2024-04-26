import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { AuthDto, TokenResponse } from './dto'
import { CreateUserDto, UserResponse } from '../user/dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	): Promise<UserResponse & TokenResponse> {
		const { refreshToken, ...response } = await this.authService.login(dto)
		await this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: CreateUserDto,
		@Res({ passthrough: true }) res: Response
	): Promise<UserResponse & TokenResponse> {
		const { refreshToken, ...response } = await this.authService.register(dto)
		await this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	): Promise<TokenResponse> {
		const { refreshToken, ...response } = await this.authService.getNewTokens(
			req,
			res
		)
		await this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
		await this.authService.removeRefreshTokenFromResponse(res)
	}
}
