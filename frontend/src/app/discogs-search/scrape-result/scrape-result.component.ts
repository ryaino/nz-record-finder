import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-scrape-result',
  templateUrl: './scrape-result.component.html',
  styleUrls: ['./scrape-result.component.scss'],
})
export class ScrapeResultComponent implements AfterViewInit {
  @Input()
  imageSrc!: string;
  @Input()
  link!: string;
  @Input()
  price!: number;
  @Input()
  text!: string;

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
}
