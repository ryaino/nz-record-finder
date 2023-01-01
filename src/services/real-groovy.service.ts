import { Injectable } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { SearchableObject } from '../models/searchable-object.model';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser, Page } from 'puppeteer';
import { elementAt } from 'rxjs';

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
    console.log(Array.of(result.values()));
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
    const filteredHits = [];
    const uniqueHits = [];
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
      for (const title of searchableObject.titles) {
        for (const artist of searchableObject.artistNames) {
          if (
            text.toLowerCase().includes(title.toLowerCase()) &&
            caption.includes('LP') &&
            artistName.toLowerCase().includes(artist.toLowerCase())
          ) {
            const unique = {
              link: link,
              title: title,
              artistName: artistName,
              price: price,
            };
            uniqueHits.push(unique);
          }
        }
      }
    }
    return uniqueHits;
  }
}
