import { Module } from '@nestjs/common'
import { TimerController } from './timer.controller'
import { TimerService } from './timer.service'
import { RepositoryModule } from '../repository/repository.module'
import { UserModule } from '../user/user.module'

@Module({
	imports: [RepositoryModule, UserModule],
	controllers: [TimerController],
	providers: [TimerService],
	exports: [TimerService]
})
export class TimerModule {}
