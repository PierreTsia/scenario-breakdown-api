import { Module } from '@nestjs/common';
import { TextParserService } from './text-parser.service';

@Module({
  providers: [TextParserService],
})
export class TextParserModule {}
