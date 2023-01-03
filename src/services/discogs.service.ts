import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { DiscogsSearchResults } from '../models/discogs-search-result.type';
import { DiscogsMasterVersions } from '../models/discogs-master-versions';
import { DiscogsRelease } from '../models/discogs-release';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscogsService {
  private key = this.configService.get('DISCOGS_KEY');
  private secret = this.configService.get('DISCOGS_SECRET');

  rootUrl = 'https://api.discogs.com';
  searchUrl = this.rootUrl + '/database/search?q=';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  search(searchTerm: string): Observable<AxiosResponse<DiscogsSearchResults>> {
    const finalUrl =
      this.searchUrl +
      searchTerm +
      '&key=' +
      this.key +
      '&secret=' +
      this.secret +
      '&type=master';
    return this.httpService.get(finalUrl, {
      headers: {
        'Accept-Encoding': '*',
      },
    });
  }

  getMaster(
    masterId: string,
  ): Observable<AxiosResponse<DiscogsMasterVersions>> {
    const finalUrl =
      this.rootUrl + '/masters/' + masterId + '/versions?format=Vinyl';
    return this.httpService.get(finalUrl, {
      headers: {
        'Accept-Encoding': '*',
      },
    });
  }

  getRelease(releaseId: string): Observable<AxiosResponse<DiscogsRelease>> {
    const finalUrl = this.rootUrl + '/releases/' + releaseId;
    return this.httpService.get(finalUrl, {
      headers: {
        'Accept-Encoding': '*',
      },
    });
  }
}
