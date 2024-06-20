import { Module } from '@nestjs/common'
import { TimeBlockController } from './time-block.controller'
import { TimeBlockService } from './time-block.service'
import { RepositoryModule } from '../repository/repository.module'

@Module({
	imports: [RepositoryModule],
	controllers: [TimeBlockController],
	providers: [TimeBlockService],
	exports: [TimeBlockService]
})
export class TimeBlockModule {}
