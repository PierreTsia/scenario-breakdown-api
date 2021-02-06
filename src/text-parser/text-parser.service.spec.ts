import { Test, TestingModule } from '@nestjs/testing';
import { TextParserService } from './text-parser.service';

describe('TextParserService', () => {
  //let service: TextParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextParserService],
    }).compile();

    //service = module.get<TextParserService>(TextParserService);
  });
});
