import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)

	const port = configService.get<number>('PORT') || 4200
	const corsOrigin =
		configService.get<string>('CORS_ORIGIN') || 'http://localhost:3001'

	app.setGlobalPrefix('api')

	app.use(cookieParser())

	app.enableCors({
		origin: [corsOrigin],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(port)
}

bootstrap()
