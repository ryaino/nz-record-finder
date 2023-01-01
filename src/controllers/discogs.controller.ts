import { Controller, Get, Post, Query } from '@nestjs/common';
import { DiscogsService } from '../services/discogs.service';
import { firstValueFrom } from 'rxjs';
import { DiscogsSearchResult } from '../models/discogs-search-result';

@Controller('discogs')
export class DiscogsController {
  constructor(private discogsService: DiscogsService) {}

  @Post('search')
  async getSearch(@Query('searchTerm') searchTerm) {
    const { data } = await firstValueFrom(
      this.discogsService.search(searchTerm),
    );
    return data;
  }

  @Get('master')
  async getMaster(@Query('id') masterId) {
    const { data } = await firstValueFrom(
      this.discogsService.getMaster(masterId),
    );
    return data;
  }
}
