import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarbecksHit } from '../../../../src/models/marbecks-hit.model';
import { RealGroovyHit } from '../../../../src/models/real-groovy-hit.model';
import { JustForTheRecordHit } from '../../../../src/models/just-for-the-record-hit.model';

export type ScrapeResult = {
  marbecksHits: MarbecksHit[];
  realGroovyHits: RealGroovyHit[];
  justForTheRecordHits: JustForTheRecordHit[];
};

@Injectable({
  providedIn: 'root',
})
export class ScraperService {
  constructor(private http: HttpClient) {}

  doScrape(masterId: number): Observable<ScrapeResult> {
    return this.http.post<ScrapeResult>(
      'https://cd87-163-47-236-43.au.ngrok.io/scrape',
      {},
      {
        params: {
          masterId: masterId,
        },
      },
    );
  }
}
