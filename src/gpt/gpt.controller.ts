import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';

import {
  AudioToTextDto,
  ImageGenerationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
  ImageVariationDto
} from './dtos';
import type { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(
    private readonly _gptService: GptService
  ) { }

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this._gptService.orthographyCheck(orthographyDto);
  }

  @Post('translate')
  translateLanguage(
    @Body() translateDto: TranslateDto
  ) {
    return this._gptService.translateLanguage(translateDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ) {
    return this._gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  /*******************************************************************************
    @Res() res: Response => vamos a emitir respuesta segun openai vaya enviando
    no recibimos la resp. de golpe sino iremos recibiendo linea en linea con STREAM 
  ********************************************************************************/

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response

  ) {
    const stream = await this._gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece);

    }

    res.end();

  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
  ) {

    const filePath = await this._gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ) {
    const filePath = await this._gptService.getAudio(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`; // 190720234.mp3
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5MB' }),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,

  ) {
    console.log({ audioToTextDto });

    return this._gptService.audioToText(file, audioToTextDto);

  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  ) {
    return await this._gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(
    @Res() res: Response,
    @Param('filename') filename: string
  ) {
    const filePath = await this._gptService.getImageGenerationPath(filename);
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto
  ) {
    return await this._gptService.generateImageVariation(imageVariationDto);
  }


}
