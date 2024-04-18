import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/guards'

export const Auth = () => UseGuards(JwtAuthGuard)
