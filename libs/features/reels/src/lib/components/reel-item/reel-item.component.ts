import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialReelFacade } from '@fe/domain/social';

@Component({
  standalone: true,
  selector: 'fe-reel-item',
  imports: [CommonModule],
  templateUrl: './reel-item.component.html',
  styleUrls: ['./reel-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReelItemComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() reel!: any;
  @Input() isCurrent: boolean = false;
  @Output() onLike = new EventEmitter<void>();

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  reelsService = inject(SocialReelFacade);
  private cdr = inject(ChangeDetectorRef);

  paused: boolean = false;
  showControls: boolean = false;
  progressValue: number = 0;
  isSeeking: boolean = false;
  private clickTimeout: any;
  /** Timer tự động ẩn controls sau 3 giây */
  private hideControlsTimer: any;
  /** URL đã set cho video, tránh set lại cùng URL */
  private currentSrc: string = '';

  ngAfterViewInit(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;

    // Đặt src một lần duy nhất qua code, không để Angular binding đụng vào
    if (this.reel?.videoUrl && this.reel.videoUrl !== this.currentSrc) {
      this.currentSrc = this.reel.videoUrl;
      video.src = this.reel.videoUrl;
      video.load();
    }

    // Tự phát ngay nếu đây là video current lúc đầu
    if (this.isCurrent) {
      video.play().catch(() => { /* Autoplay policy */ });
      this.paused = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Nếu videoUrl của reel thay đổi (sang video khác), cập nhật src
    if (changes['reel']) {
      const newUrl: string = changes['reel'].currentValue?.videoUrl ?? '';
      if (newUrl && newUrl !== this.currentSrc) {
        const video = this.videoPlayerRef?.nativeElement;
        if (video) {
          this.currentSrc = newUrl;
          video.src = newUrl;
          video.load();
          if (this.isCurrent) {
            video.play().catch(() => {});
            this.paused = false;
          }
        }
      }
    }

    if (changes['isCurrent']) {
      const video = this.videoPlayerRef?.nativeElement;
      if (this.isCurrent) {
        // Video được scroll đến → tự phát
        if (video && video.paused) {
          video.play().catch(() => { /* Autoplay policy */ });
          this.paused = false;
        }
      } else {
        // Video bị scroll ra khỏi view → pause
        if (video && !video.paused) {
          video.pause();
          this.paused = true;
        }
        // Ẩn controls của video không active
        this.showControls = false;
        this.clearHideTimer();
      }
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.clearHideTimer();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
  }

  handleVideoClick(videoElement: HTMLVideoElement) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      if (this.isCurrent) {
        this.onLike.emit();
      }
    } else {
      this.clickTimeout = setTimeout(() => {
        if (this.isCurrent) {
          if (this.showControls) {
            this.showControls = false;
            this.clearHideTimer();
          } else {
            this.showControls = true;
            this.startHideTimer();
          }
          this.cdr.markForCheck();
        }
        this.clickTimeout = null;
      }, 250);
    }
  }

  seek(videoElement: HTMLVideoElement, amount: number, event: Event) {
    event.stopPropagation();
    if (videoElement && videoElement.duration) {
      videoElement.currentTime = Math.max(0, Math.min(videoElement.currentTime + amount, videoElement.duration));
    }
    // Reset timer khi người dùng tương tác
    this.startHideTimer();
  }

  togglePlayPauseFromControl(videoElement: HTMLVideoElement, event: Event) {
    event.stopPropagation();
    this.togglePlayPause(videoElement);
    // Reset timer khi người dùng tương tác
    this.startHideTimer();
  }

  onTimeUpdate(videoElement: HTMLVideoElement) {
    if (this.isSeeking) return;
    if (videoElement && videoElement.duration && !isNaN(videoElement.duration)) {
      this.progressValue = (videoElement.currentTime / videoElement.duration) * 100;
      this.cdr.markForCheck();
    }
  }

  onSeekStart(event: Event) {
    event.stopPropagation();
    this.isSeeking = true;
  }

  onSeek(videoElement: HTMLVideoElement, event: Event) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    if (videoElement && videoElement.duration && !isNaN(videoElement.duration)) {
      const targetTime = (value / 100) * videoElement.duration;
      this.progressValue = value;
      videoElement.currentTime = targetTime;
    }
  }

  onSeekEnd(videoElement: HTMLVideoElement, event: Event) {
    event.stopPropagation();
    setTimeout(() => {
      this.isSeeking = false;
    }, 200);
  }

  togglePlayPause(videoElement?: HTMLVideoElement) {
    if (videoElement && typeof videoElement.play === 'function') {
      if (videoElement.paused) {
        videoElement.play();
        this.paused = false;
      } else {
        videoElement.pause();
        this.paused = true;
      }
    } else {
      this.paused = !this.paused;
    }
  }

  // ─── Controls auto-hide timer ─────────────────────────────────

  private startHideTimer(): void {
    this.clearHideTimer();
    this.hideControlsTimer = setTimeout(() => {
      this.showControls = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  private clearHideTimer(): void {
    if (this.hideControlsTimer) {
      clearTimeout(this.hideControlsTimer);
      this.hideControlsTimer = null;
    }
  }
}
