import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DiscogsSearchResult } from '../../../../../src/models/discogs-search-result';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-discogs-master',
  templateUrl: './discogs-master.component.html',
  styleUrls: ['./discogs-master.component.scss'],
})
export class DiscogsMasterComponent implements AfterViewInit {
  @Input()
  result!: DiscogsSearchResult;

  @Output()
  onClick = new EventEmitter<DiscogsSearchResult>();

  @ViewChild('card')
  card!: ElementRef;

  ngAfterViewInit(): void {
    VanillaTilt.init(this.card.nativeElement, {
      max: 25,
      speed: 400,
      reverse: true,
      scale: 1.2,
      glare: true,
    });
  }

  clicked() {
    this.onClick.emit(this.result);
  }
}
