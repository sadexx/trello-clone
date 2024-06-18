import { Module } from '@nestjs/common'
import { TaskRepository, UserRepository } from './repositories'
import { PrismaService } from 'src/prisma.service'

@Module({
	providers: [PrismaService, UserRepository, TaskRepository],
	exports: [UserRepository, TaskRepository]
})
export class RepositoryModule {}
