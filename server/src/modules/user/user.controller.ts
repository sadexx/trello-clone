import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth, CurrentUser } from 'src/common/decorators'
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async getAll(): Promise<UserResponse[]> {
		return await this.userService.getAll()
	}

	@Get('profile')
	@Auth()
	async profile(@CurrentUser('id') id: string): Promise<UserResponse> {
		return await this.userService.getProfile(id)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string): Promise<UserResponse> {
		return await this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
		return await this.userService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('me')
	@Auth()
	async updateMe(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<UserResponse> {
		return await this.userService.update(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	@Auth()
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<UserResponse> {
		return await this.userService.update(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string): Promise<void> {
		await this.userService.delete(id)
	}
}
