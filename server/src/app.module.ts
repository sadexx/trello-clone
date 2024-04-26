import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { RepositoryModule } from './modules/repository/repository.module'

@Module({
	imports: [ConfigModule.forRoot(), RepositoryModule, AuthModule, UserModule]
})
export class AppModule {}
