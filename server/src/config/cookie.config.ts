import { ConfigService } from '@nestjs/config'

export const cookieConfig = async (
	configService: ConfigService
): Promise<any> => {
	return {
		httpOnly: true,
		domain: configService.get('COOKIE_DOMAIN') || 'localhost',
		secure: true,
		sameSite: 'lax'
	}
}
