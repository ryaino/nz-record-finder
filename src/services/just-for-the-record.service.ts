import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser, Page } from 'puppeteer';
import { SearchableObject } from '../models/searchable-object.model';
import { JustForTheRecordHit } from '../models/just-for-the-record-hit.model';

@Injectable()
export class JustForTheRecordService {
  private page!: Page;

  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async scrape(searchableObject: SearchableObject) {
    const result = new Map();
    this.page = await this.browser.newPage();

    for (const title of searchableObject.titles) {
      const titleResults = await this.performSearch(
        title,
        searchableObject,
      ).catch(() => []);
      titleResults.forEach((titleResult) => {
        result.set(titleResult.link, titleResult);
      });
    }
    await this.page.close();
    return Array.from(result.values());
  }

  private async performSearch(
    searchTerm: string,
    searchableObject: SearchableObject,
  ) {
    await this.page.goto(
      'https://www.justfortherecord.co.nz/albums/?filter%5Bkeyword%5D=' +
        searchTerm.replace(/\s/g, '+'),
    );

    const hits = await this.page.$$('.product-item');
    const uniqueHits: JustForTheRecordHit[] = [];
    for (const hit of hits) {
      //NAME
      const name = await hit
        .$eval('.name', (element) => element.firstElementChild.textContent)
        .catch(() => '');
      //LINK
      const link = await hit
        .$eval(
          '.name',
          (element) =>
            element.firstElementChild.attributes.getNamedItem('href').value,
        )
        .catch(() => '');
      //PRICE
      const price = await hit
        .$eval('.price-new', (element) => element.textContent)
        .catch(() => '');
      //IMAGE
      const imageSrc = await hit
        .$eval(
          '.image',
          (element) =>
            element.firstElementChild.firstElementChild.attributes.getNamedItem(
              'src',
            ).value,
        )
        .catch(() => '');

      for (const title of searchableObject.titles) {
        if (name.toLowerCase().includes(title.toLowerCase())) {
          const unique = {
            link: 'https://www.justfortherecord.co.nz' + link,
            artistAndTitle: name,
            price: Number(price.replace(/[^0-9\.]+/g, '')),
            imageSrc: 'https://www.justfortherecord.co.nz' + imageSrc,
          };
          uniqueHits.push(unique);
        }
      }
    }
    return uniqueHits;
  }
}
