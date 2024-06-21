import { Module } from '@nestjs/common'
import {
	TaskRepository,
	TimeBlockRepository,
	TimerRepository,
	UserRepository
} from './repositories'
import { PrismaService } from 'src/prisma.service'

@Module({
	providers: [
		PrismaService,
		UserRepository,
		TaskRepository,
		TimeBlockRepository,
		TimerRepository
	],
	exports: [
		UserRepository,
		TaskRepository,
		TimeBlockRepository,
		TimerRepository
	]
})
export class RepositoryModule {}
