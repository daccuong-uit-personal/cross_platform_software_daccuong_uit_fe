import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialReelFacade } from '@fe/domain/social';

@Component({
  standalone: true,
  selector: 'fe-reels',
  imports: [CommonModule],
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.css'],
})
export class ReelsComponent implements AfterViewInit {
  @ViewChild('reelsContainer') reelsContainer!: ElementRef<HTMLDivElement>;

  reelsService = inject(SocialReelFacade);

  ngAfterViewInit() {
    if (!this.reelsContainer) return;
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') { e.preventDefault(); this.reelsService.goToPrev(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); this.reelsService.goToNext(); }
    if (e.key === 'Escape') { this.reelsService.closeComments(); }
  }

  private isScrolling = false;

  @HostListener('window:wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (this.isScrolling) return;
    
    // Determine direction
    if (e.deltaY > 50) {
      this.reelsService.goToNext();
      this.lockScroll();
    } else if (e.deltaY < -50) {
      this.reelsService.goToPrev();
      this.lockScroll();
    }
  }

  private lockScroll() {
    this.isScrolling = true;
    setTimeout(() => {
      this.isScrolling = false;
    }, 600); // Prevent multiple scrolls within 600ms
  }
}
