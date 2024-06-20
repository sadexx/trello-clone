import { PartialType } from '@nestjs/mapped-types'
import { CreateTimeBlockDto } from './create-timeBlock.request.dto'

export class UpdateTimeBlockDto extends PartialType(CreateTimeBlockDto) {}
