import { PartialType } from '@nestjs/swagger';
import { CreateConversionHistoryDto } from './create-conversion-history.dto';

export class UpdateConversionHistoryDto extends PartialType(CreateConversionHistoryDto) {}
