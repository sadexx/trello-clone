import { Module } from '@nestjs/common'
import { TaskController } from './task.controller'
import { PrismaService } from 'src/prisma.service'
import { TaskService } from './task.service'
import { RepositoryModule } from '../repository/repository.module'

@Module({
	imports: [RepositoryModule],
	controllers: [TaskController],
	providers: [TaskService, PrismaService],
	exports: [TaskService]
})
export class TaskModule {}
