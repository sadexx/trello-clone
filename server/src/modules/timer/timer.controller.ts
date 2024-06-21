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
import { TimerService } from './timer.service'
import { Auth, CurrentUser } from 'src/common/decorators'
import { TimerRoundDto } from './dto/request/timer-round.request.dto'
import {
	TimerRoundResponseDto,
	TimerSessionDto,
	TimerSessionResponseDto
} from './dto'

@Controller('user/timer')
export class TimerController {
	constructor(private readonly timerService: TimerService) {}

	@Get('today')
	@Auth()
	async getTodaySession(
		@CurrentUser('id') userId: string
	): Promise<TimerSessionResponseDto> {
		return await this.timerService.getTodaySession(userId)
	}

	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@CurrentUser('id') userId: string
	): Promise<TimerSessionResponseDto> {
		return await this.timerService.create(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('/round/:id')
	@Auth()
	async updateRound(
		@Param('id') id: string,
		@Body() dto: TimerRoundDto
	): Promise<TimerRoundResponseDto> {
		return await this.timerService.updateRound(dto, id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	@Auth()
	async update(
		@Body() dto: TimerSessionDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	): Promise<TimerSessionResponseDto> {
		return await this.timerService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	): Promise<void> {
		return await this.timerService.delete(id, userId)
	}
}
