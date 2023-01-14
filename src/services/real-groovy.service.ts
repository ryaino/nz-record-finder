import { Injectable } from '@nestjs/common';
import { SearchableObject } from '../models/searchable-object.model';
import { Browser, Page } from 'puppeteer';
import { RealGroovyHit } from '../models/real-groovy-hit.model';
import { InjectBrowser } from '../../nest-puppeteer/src';

@Injectable()
export class RealGroovyService {
  private page!: Page;

  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async scrape(searchableObject: SearchableObject) {
    const result = new Map();
    this.page = await this.browser.newPage();
    await this.page.goto('https://realgroovy.co.nz/');

    for (const barcode of searchableObject.barcodes) {
      const barcodeResults = await this.performSearch(
        barcode,
        searchableObject,
      );
      barcodeResults.forEach((barcodeResult) => {
        result.set(barcodeResult.link, barcodeResult);
      });
    }
    await this.page.close();
    return Array.from(result.values());
  }

  async performSearch(searchTerm: string, searchableObject: SearchableObject) {
    //SELECT SEARCH BOX
    const searchBox = (await this.page.waitForSelector(
      '#search-input-hero',
    )) as unknown as HTMLInputElement;
    //CLEAR SEARCH BOX
    await searchBox.click();
    await this.page.keyboard.press('ArrowLeft', {
      commands: ['SelectAll', 'Delete'],
    });
    //PUT SEARCH TERM INTO SEARCH BOX
    await this.page.keyboard.type(searchTerm);
    //SUBMIT SEARCH
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.keyboard.press('Enter'),
    ]);

    const hits = await this.page.$$('.ais-hits--item');
    const uniqueHits: RealGroovyHit[] = [];
    for (const hit of hits) {
      //TITLE
      const text = await hit
        .$eval('.text', (element) => element.textContent)
        .catch(() => '');
      //CAPTION
      const caption = await hit
        .$eval('.caption', (element) => element.textContent)
        .catch(() => '');
      //LINK
      const link = await hit
        .$eval(
          '.display-card',
          (element) => element.attributes.getNamedItem('href').value,
        )
        .catch(() => '');
      //ARTIST NAME
      const artistName = await hit
        .$eval('.subtitle', (element) => element.textContent)
        .catch(() => '');
      //PRICE
      const price = await hit
        .$eval('.title', (element) => element.textContent)
        .catch(() => '');
      //IMAGE
      const imageSrc = await hit
        .$eval(
          '.img',
          (element) => element.attributes.getNamedItem('src').value,
        )
        .catch(() => '');

      for (const title of searchableObject.titles) {
        if (
          text.toLowerCase().includes(title.toLowerCase()) &&
          caption.includes('LP')
        ) {
          const unique = {
            link: 'https://realgroovy.co.nz' + link,
            title: text,
            artistName: artistName,
            price: Number(price.replace(/[^0-9\.]+/g, '')),
            imageSrc: imageSrc,
          };
          uniqueHits.push(unique);
        }
      }
    }
    return uniqueHits;
  }
}
