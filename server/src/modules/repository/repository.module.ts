import { Module } from '@nestjs/common'
import {
	TaskRepository,
	TimeBlockRepository,
	UserRepository
} from './repositories'
import { PrismaService } from 'src/prisma.service'

@Module({
	providers: [
		PrismaService,
		UserRepository,
		TaskRepository,
		TimeBlockRepository
	],
	exports: [UserRepository, TaskRepository, TimeBlockRepository]
})
export class RepositoryModule {}
