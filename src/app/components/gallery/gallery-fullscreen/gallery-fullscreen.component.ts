import {Component, Input, OnDestroy} from '@angular/core';
import {Image} from '../../../shared/models/gallery-model';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent, interval, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

interface DisplayedImage extends Image {
  cssClass: string;
}

interface DisplayedColumn {
  images: DisplayedImage[];
  imageCount: number;
  heightSum: number;
}

type CallbackFn = () => void;

@Component({
  selector: 'app-gallery-fullscreen',
  templateUrl: './gallery-fullscreen.component.html',
  styleUrls: ['./gallery-fullscreen.component.scss']
})
export class GalleryFullscreenComponent implements OnDestroy {
  private readonly  DEFAULT_DURATION = 6000;
  public readonly MIN_DURATION =  1000;
  public readonly CHANGE_DURATION_SIZE =  500;

  public visible = false;

  @Input()
  public playbackDuration = this.DEFAULT_DURATION;

  @Input()
  public images: DisplayedImage[] = [];

  @Input()
  public activeImageIdx: number = 0;
  public image?: DisplayedImage;
  public timerProgress = 0;
  public isPlaying = false;
  private playbackSubscription?: Subscription;
  private keyHandlingSubscription?: Subscription;
  private afterCloseCallback?: CallbackFn;

  public constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  private static enableScrolling(): void {
    const body = document.querySelector('body');
    if (!body) {
      return;
    }
    body.style.overflow = 'auto';
  }

  private static disableScrolling(): void {
    const body = document.querySelector('body');
    if (!body) {
      return;
    }
    body.style.overflow = 'hidden';
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public pausePlayback() {
    this.playbackSubscription?.unsubscribe();
    this.isPlaying = false;
    this.timerProgress = 0;
  }

  public startPlayback() {
    this.playbackSubscription?.unsubscribe();
    this.isPlaying = true;

    const sliceSize = 200;
    let passed = 0;
    this.playbackSubscription = interval(sliceSize).subscribe(() => {
      passed += sliceSize;
      if (passed >= this.playbackDuration) {
        this.playbackSubscription?.unsubscribe();
        this.next();
      }
      this.timerProgress = Math.ceil(passed / this.playbackDuration * 100);
    });
  }

  public open(imageId: string): { afterClose: (cbk: CallbackFn) => void } {
    const idx = this.images.findIndex(image => image.id === imageId);
    this.visible = true;
    this.showImage(idx ?? 0);
    GalleryFullscreenComponent.disableScrolling();
    this.bindKeyboardInputHandling();

    return {
      afterClose: (cbk: CallbackFn) => {
        this.afterCloseCallback = cbk;
      }
    }
  }

  public close() {
    this.destroy();
  }

  private destroy() {
    this.pausePlayback();
    this.visible = false;
    GalleryFullscreenComponent.enableScrolling();
    this.unsubscribeAll();

    this.afterCloseCallback?.call(this);
    this.afterCloseCallback = undefined;
  }

  public previous() {
    this.switchIdxBy(-1);
  }

  public next() {
    this.switchIdxBy(1);
  }

  public switchIdxBy(value: number) {
    let nextIdx = this.activeImageIdx + value;
    if (nextIdx >= this.images.length) {
      nextIdx = 0;
    }
    if (nextIdx < 0) {
      nextIdx = this.images.length - 1;
    }
    this.showImage(nextIdx);

    if (this.isPlaying) {
      this.startPlayback();
    }
  }

  public showOriginalImage($event: MouseEvent, image: DisplayedImage) {
    $event.preventDefault();
    window.open(image.original_url, "_blank", image.id);
  }

  private showImage(imageIdx: number) {
    this.activeImageIdx = Math.max(0, Math.min(imageIdx, this.images.length - 1));
    this.image = this.images[imageIdx];
  }

  private bindKeyboardInputHandling(): void {
    this.keyHandlingSubscription = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      debounceTime(200)
    ).subscribe((event) => {
      switch (event.key) {
        case "Escape":
          this.close();
          break;
        case "ArrowLeft":
        case "A":
          this.previous();
          break;
        case "ArrowRight":
        case "D":
          this.next();
          break;
        case " ":
        case "Enter":
          if(this.isPlaying) {
            this.pausePlayback();
          } else {
            this.startPlayback()
          }
          break;
      }
    });
  }

  private unsubscribeAll(): void {
    this.keyHandlingSubscription?.unsubscribe();
    this.playbackSubscription?.unsubscribe();
  }

  public changePlaybackSpeedClicked($event: MouseEvent, amount: number): void {
    $event.stopImmediatePropagation();
    const duration = this.playbackDuration + amount;
    this.playbackDuration = Math.max(this.MIN_DURATION, duration);
  }
}
