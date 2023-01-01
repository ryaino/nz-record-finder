import { Injectable } from '@nestjs/common';
import { DiscogsService } from './services/discogs.service';
import { firstValueFrom } from 'rxjs';
import { DiscogsRelease } from './models/discogs-release';
import { SearchableObject } from './models/searchable-object.model';
import { RealGroovyService } from './services/real-groovy.service';

@Injectable()
export class AppService {
  constructor(
    private discogsService: DiscogsService,
    private realGroovyService: RealGroovyService,
  ) {}

  async scrape(masterId: string) {
    const releaseIds = await this.getAllReleaseIdsFromMaster(masterId);
    const releases: DiscogsRelease[] = await this.getAllReleases(releaseIds);
    const searchableObject: SearchableObject =
      this.convertReleasesToSearchableObject(releases);
    const results = await this.scrapeAllSites(searchableObject);
    return results;
  }

  async getAllReleaseIdsFromMaster(masterId: string): Promise<number[]> {
    const { data } = await firstValueFrom(
      this.discogsService.getMaster(masterId),
    );
    const releaseIds = [];
    data.versions.forEach((version) => {
      releaseIds.push(version.id);
    });
    return releaseIds;
  }

  async getAllReleases(releaseIds: number[]) {
    const releases: DiscogsRelease[] = [];

    for (const id of releaseIds) {
      await firstValueFrom(this.discogsService.getRelease(id.toString())).then(
        (result) => {
          const { data } = result;
          const release = {
            title: data.title,
            id: data.id,
            thumb: data.thumb,
            identifiers: data.identifiers,
            artists: data.artists,
          };
          releases.push(release);
        },
      );
    }
    return releases;
  }

  private convertReleasesToSearchableObject(releases: DiscogsRelease[]) {
    const artistNames = new Set<string>();
    const barcodes = new Set<string>();
    const titles = new Set<string>();
    for (const release of releases) {
      release.artists.forEach((artist) => {
        artistNames.add(artist.name);
      });

      release.identifiers.forEach((identifier) => {
        if (identifier.type.toLowerCase().includes('barcode')) {
          barcodes.add(identifier.value);
        }
      });

      titles.add(release.title);
    }

    return {
      titles: [...titles],
      artistNames: [...artistNames],
      barcodes: [...barcodes],
    };
  }

  private async scrapeAllSites(searchableObject: SearchableObject) {
    return await this.realGroovyService.scrape(searchableObject);
  }
}
