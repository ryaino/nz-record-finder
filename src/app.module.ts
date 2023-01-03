import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { PuppeteerService } from './services/puppeteer.service';
import { DiscogsService } from './services/discogs.service';
import { DiscogsController } from './controllers/discogs.controller';
import { HttpModule } from '@nestjs/axios';
import { RealGroovyService } from './services/real-groovy.service';
import { JustForTheRecordService } from './services/just-for-the-record.service';
import { MarbecksService } from './services/marbecks.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PuppeteerModule.forRoot(), HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, DiscogsController],
  providers: [
    AppService,
    PuppeteerService,
    DiscogsService,
    RealGroovyService,
    JustForTheRecordService,
    MarbecksService,
  ],
})
export class AppModule {}
