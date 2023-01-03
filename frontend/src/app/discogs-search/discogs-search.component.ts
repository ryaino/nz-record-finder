import { Component, OnDestroy, OnInit } from '@angular/core';
import { DiscogsSearchService } from './discogs-search.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { DiscogsSearchResults } from '../../../../src/models/discogs-search-result.type';
import { FormControl } from '@angular/forms';
import { ScrapeResult, ScraperService } from './scraper.service';
import { DiscogsSearchResult } from '../../../../src/models/discogs-search-result';

@Component({
  selector: 'app-discogs-search',
  templateUrl: './discogs-search.component.html',
  styleUrls: ['./discogs-search.component.scss'],
})
export class DiscogsSearchComponent implements OnInit, OnDestroy {
  searchResults$!: Observable<DiscogsSearchResults>;
  scraperResult$!: Observable<ScrapeResult>;
  searchResults!: DiscogsSearchResults;
  scrapeResult!: ScrapeResult;

  selectedResult?: DiscogsSearchResult;

  isLoading = false;

  searchInput = new FormControl('');
  showScrapedResults = false;
  showSearchResults = true;

  constructor(
    private discogsSearchService: DiscogsSearchService,
    private scraperService: ScraperService,
  ) {}

  doSearch() {
    this.showSearchResults = true;
    this.scrapeResult = {
      justForTheRecordHits: [],
      marbecksHits: [],
      realGroovyHits: [],
    };
    this.showScrapedResults = false;
    this.searchResults$ = this.discogsSearchService.doSearch(
      this.searchInput.value!,
    );
    this.searchResults$.subscribe((val) => {
      this.searchResults = val;
    });
  }

  ngOnInit(): void {
    // this.doSearch();
    // this.scrapeResult = {
    //   realGroovyHits: [
    //     {
    //       link: 'https://realgroovy.co.nz/product/075678669637/blurryface',
    //       title: 'Blurryface',
    //       artistName: 'Twenty One Pilots',
    //       price: 74.95,
    //       imageSrc:
    //         'https://d3rjjq7fi1tbk0.cloudfront.net/superfile/075678669637.jpg',
    //     },
    //     {
    //       link: 'https://realgroovy.co.nz/product/075678645617/blurryface-silver-edition-vinyl',
    //       title: 'Blurryface (Silver Edition) (Vinyl)',
    //       artistName: 'Twenty One Pilots',
    //       price: 84.95,
    //       imageSrc:
    //         'https://d3rjjq7fi1tbk0.cloudfront.net/product/075678645617/4016483-2752691.jpg',
    //     },
    //     {
    //       link: 'https://realgroovy.co.nz/product/075678645617/blurryface',
    //       title: 'Blurryface',
    //       artistName: 'Twenty One Pilots',
    //       price: 84.95,
    //       imageSrc:
    //         'https://d3rjjq7fi1tbk0.cloudfront.net/superfile/075678645617.jpg',
    //     },
    //   ],
    //   justForTheRecordHits: [
    //     {
    //       link: 'https://www.justfortherecord.co.nz/albums/twenty-one-pilots-blurryface-silver-vinyl/',
    //       artistAndTitle: 'Twenty One Pilots - Blurryface (Silver Vinyl)',
    //       price: 85,
    //       imageSrc:
    //         'https://www.justfortherecord.co.nz/assets/Images/Albums/_resampled/PadWyI4MDAiLCI4MDAiLCJGRkZGRkYiLDBd/R-20588329-1634894504-8468.jpeg.jpg',
    //     },
    //     {
    //       link: 'https://www.justfortherecord.co.nz/albums/twenty-one-pilots-blurryface-2/',
    //       artistAndTitle: ' Twenty One Pilots - Blurryface ',
    //       price: 35,
    //       imageSrc:
    //         'https://www.justfortherecord.co.nz/assets/Images/Albums/_resampled/PadWyI4MDAiLCI4MDAiLCJGRkZGRkYiLDBd/R-8007072-1534764423-2996.jpeg.jpg',
    //     },
    //   ],
    //   marbecksHits: [
    //     {
    //       title: 'Blurryface (LP)',
    //       artistName: 'Twenty One Pilots',
    //       link: 'https://marbecks.co.nz//detail/541799/Blurryface',
    //       price: 70,
    //       imageSrc:
    //         'https://images.marbecks.co.nz/_thumbnails/10541/10541799.jpg',
    //     },
    //     {
    //       title: 'Blurryface (Limited LP)',
    //       artistName: 'Twenty One Pilots',
    //       link: 'https://marbecks.co.nz//detail/592428/Blurryface-Limited-Vinyl',
    //       price: 90,
    //       imageSrc:
    //         'https://images.marbecks.co.nz/_thumbnails/10592/10592428.jpg',
    //     },
    //   ],
    // };
  }

  async scrape(result: DiscogsSearchResult) {
    this.selectedResult = result;
    this.isLoading = true;
    this.showSearchResults = false;
    await firstValueFrom(this.scraperService.doScrape(result.id)).then(
      (result) => {
        this.searchResults = { pagination: undefined, results: [] };
        this.scrapeResult = result;
        this.isLoading = false;
        this.showScrapedResults = true;
      },
    );
  }

  ngOnDestroy(): void {}
}
