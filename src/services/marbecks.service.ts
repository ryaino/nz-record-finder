import { Injectable } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
import { InjectBrowser } from 'nest-puppeteer';
import { SearchableObject } from '../models/searchable-object.model';
import { MarbecksHit } from '../models/marbecks-hit.model';

@Injectable()
export class MarbecksService {
  private page!: Page;

  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async scrape(searchableObject: SearchableObject) {
    const result = new Map();
    this.page = await this.browser.newPage();
    await this.page.goto('https://www.marbecks.co.nz/').catch(() => []);

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

  private async performSearch(
    searchTerm: string,
    searchableObject: SearchableObject,
  ) {
    //SELECT SEARCH BOX
    const searchBox = (await this.page.waitForSelector(
      '#searchTerm_quicksearch',
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

    const hits = await this.page.$$('.resultslist tbody tr');
    const uniqueHits: MarbecksHit[] = [];
    for (const hit of hits) {
      //TITLE
      const title = await hit
        .$eval('.albumtitle', (element) => element.textContent)
        .catch(() => '');
      // LINK
      const link = await hit
        .$eval(
          '.details',
          (element) =>
            element.firstElementChild.attributes.getNamedItem('href').value,
        )
        .catch(() => '');
      //ARTIST NAME
      const artistName = await hit
        .$eval('.artistname', (element) => element.textContent)
        .catch(() => '');
      //PRICE
      const price = await hit
        .$eval('.price', (element) => element.textContent)
        .catch(() => '');
      //IMAGE SOURCE
      const imageSrc = await hit
        .$eval(
          '.coverimage',
          (element) => element.attributes.getNamedItem('src').value,
        )
        .catch(() => '');
      //DESCRIPTION
      const description = await hit
        .$eval('.description', (element) => element.textContent)
        .catch(() => '');
      for (const searchTitle of searchableObject.titles) {
        console.log('title: ' + title);
        console.log(searchTitle);
        console.log(title.toLowerCase().includes(searchTitle));
        console.log(description.includes('LP'));

        if (
          title.toLowerCase().includes(searchTitle.toLowerCase()) &&
          description.includes('LP')
        ) {
          const unique = {
            title: title,
            artistName: artistName,
            link: 'https://marbecks.co.nz/' + link,
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
