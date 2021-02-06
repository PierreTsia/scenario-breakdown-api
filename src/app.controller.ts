import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { Public } from './auth/public.decorator';

import { TextParserService } from './text-parser/text-parser.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private textParserService: TextParserService,
  ) {}

  @Public()
  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}

/*const imagekit = new Imagekit({
    publicKey: 'public_ok6tHaKWYw7riVQ/OMoXCYAv6K4=',
    privateKey: 'private_pU29OjR+S5uUNiN16+PBjzlBcmU=',
    urlEndpoint: 'https://ik.imagekit.io/p4d4w4n/',
  });
  console.log(file);

  const res = await imagekit.upload({
    file: file.buffer, //required
    fileName: 'my_file_name.jpg', //required
    folder: 'test',
  });*/
