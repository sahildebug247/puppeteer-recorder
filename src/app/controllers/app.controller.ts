import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import AppService from '../services/app.service';

@Controller('')
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('record')
  public async record(
    @Query('url') url: string,
    @Query('timeout') timeout: number
  ) {
    this.appService.record(timeout, url);
  }

  @Get('log')
  public async log(@Query('q') log: string) {
    console.log({ log: JSON.stringify(log) });
  }
}

export default AppController;
