import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { RepositoryModule } from '../repository/repository.module'
import { TaskModule } from '../task/task.module'

@Module({
	imports: [RepositoryModule, TaskModule],
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService]
})
export class UserModule {}
