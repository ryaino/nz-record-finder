import { Injectable } from '@nestjs/common';
import { InjectBrowser } from '../../nest-puppeteer/src';
import { Browser } from 'puppeteer';

@Injectable()
export class PuppeteerService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async scrape() {
    const page = await this.browser.newPage();
    await page.goto('https://realgroovy.co.nz/');
    const content = await page.content();
    await page.close();
    return content;
  }
}
