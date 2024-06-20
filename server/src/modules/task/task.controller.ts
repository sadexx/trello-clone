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
import { TaskService } from './task.service'
import { Auth, CurrentUser } from 'src/common/decorators'
import { CreateTaskDto, TaskResponse, UpdateTaskDto } from './dto'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAll(): Promise<TaskResponse[]> {
		return await this.taskService.getAll()
	}

	@Get('user')
	@Auth()
	async getAllByUser(
		@CurrentUser('id') userId: string
	): Promise<TaskResponse[]> {
		return await this.taskService.getAllByUser(userId)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string): Promise<TaskResponse> {
		return await this.taskService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@Body() dto: CreateTaskDto,
		@CurrentUser('id') userId: string
	): Promise<TaskResponse> {
		return await this.taskService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	@Auth()
	async update(@Body() dto: UpdateTaskDto, @Param('id') id: string) {
		return this.taskService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string): Promise<void> {
		await this.taskService.delete(id)
	}
}
