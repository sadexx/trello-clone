import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.request.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {}
