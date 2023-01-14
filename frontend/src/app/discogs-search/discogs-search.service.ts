import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiscogsSearchResults } from '../../../../src/models/discogs-search-result.type';

@Injectable({
  providedIn: 'root',
})
export class DiscogsSearchService {
  constructor(private http: HttpClient) {}

  doSearch(searchTerm: string): Observable<DiscogsSearchResults> {
    const options = {
      params: new HttpParams().set('searchTerm', searchTerm),
    };
    return this.http.post<DiscogsSearchResults>(
      'https://a214-163-47-236-43.au.ngrok.io/discogs/search',
      {},
      {
        params: {
          searchTerm: searchTerm,
        },
      },
    );
  }
}
