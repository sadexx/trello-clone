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
import { TimeBlockService } from './time-block.service'
import { Auth, CurrentUser } from 'src/common/decorators'
import {
	UpdateOrderDto,
	TimeBlockResponse,
	CreateTimeBlockDto,
	UpdateTimeBlockDto
} from './dto'

@Controller('time-blocks')
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAll(): Promise<TimeBlockResponse[]> {
		return await this.timeBlockService.getAll()
	}

	@Get('user')
	@Auth()
	async getAllByUser(
		@CurrentUser('id') userId: string
	): Promise<TimeBlockResponse[]> {
		return await this.timeBlockService.getAllByUser(userId)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string): Promise<TimeBlockResponse> {
		return await this.timeBlockService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@Body() dto: CreateTimeBlockDto,
		@CurrentUser('id') userId: string
	): Promise<TimeBlockResponse> {
		return await this.timeBlockService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-order')
	@Auth()
	async updateOrder(@Body() dto: UpdateOrderDto): Promise<TimeBlockResponse[]> {
		return await this.timeBlockService.updateOrder(dto.ids)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	@Auth()
	async update(
		@Body() dto: UpdateTimeBlockDto,
		@Param('id') id: string
	): Promise<TimeBlockResponse> {
		return await this.timeBlockService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string): Promise<void> {
		await this.timeBlockService.delete(id)
	}
}
