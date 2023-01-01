import { DiscogsSearchResult } from './discogs-search-result';

export type DiscogsSearchResults = {
  pagination: any;
  results: [DiscogsSearchResult];
};
