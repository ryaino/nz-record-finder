import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PuppeteerService } from './services/puppeteer.service';

@Controller()
export class AppController {
  constructor(
    private readonly puppeteerService: PuppeteerService,
    private appService: AppService,
  ) {}

  @Post('scrape')
  async scrape(@Query('masterId') masterId) {
    return this.appService.scrape(masterId);
  }
}
