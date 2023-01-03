import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscogsSearchComponent } from './discogs-search/discogs-search.component';
import { HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiscogsMasterComponent } from './discogs-search/discogs-master/discogs-master.component';
import { ScrapeResultComponent } from './discogs-search/scrape-result/scrape-result.component';

@NgModule({
  declarations: [AppComponent, DiscogsSearchComponent, DiscogsMasterComponent, ScrapeResultComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
