import { Module } from '@nestjs/common'
import { UserRepository } from './repositories'
import { PrismaService } from 'src/prisma.service'

@Module({
	providers: [PrismaService, UserRepository],
	exports: [UserRepository]
})
export class RepositoryModule {}
