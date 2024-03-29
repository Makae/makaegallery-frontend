import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Image} from '../../../shared/models/gallery-model';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent, interval, of, Subscription, timer, zip} from 'rxjs';
import {debounceTime, filter, map, startWith, switchMap, tap} from 'rxjs/operators';

interface DisplayedImage extends Image {
  cssClass: string;
}

type CallbackFn = () => void;

@Component({
  selector: 'app-gallery-fullscreen',
  templateUrl: './gallery-fullscreen.component.html',
  styleUrls: ['./gallery-fullscreen.component.scss']
})
export class GalleryFullscreenComponent implements OnInit, OnDestroy {
  public readonly MIN_DURATION = 1000;
  public readonly CHANGE_DURATION_SIZE = 500;
  public readonly CONTROLS_HIDE_DELAY = 2000;
  @Input()
  public images: DisplayedImage[] = [];
  @Input()
  public activeImageIdx: number = 0;
  @Input()

  public visible = false;
  public image?: DisplayedImage;
  public timerProgress = 0;
  public isPlaying = false;
  public showControls = true;
  private readonly SWIPE_THRESHOLD = 40;
  private readonly DEFAULT_DURATION = 6000;
  public playbackDuration = this.DEFAULT_DURATION;
  private showControlsSubscription?: Subscription;
  private playbackSubscription?: Subscription;
  private keyHandlingSubscription?: Subscription;
  private swipeHandlingSubscription?: Subscription;
  private afterCloseCallback?: CallbackFn;

  public constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  private static enableScrolling(): void {
    GalleryFullscreenComponent.getBody()!.style.overflow = 'auto';
  }

  private static disableScrolling(): void {
    GalleryFullscreenComponent.getBody()!.style.overflow = 'hidden';
  }

  private static getBody(): HTMLBodyElement | null {
    return document.querySelector('body');
  }

  private static getDistance(start: TouchEvent, end: TouchEvent): { x: number; y: number; } {
    return {
      x: start.changedTouches[0].clientX - end.changedTouches[0].clientX,
      y: start.changedTouches[0].clientY - end.changedTouches[0].clientY,
    }
  }

  public ngOnInit(): void {
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
    this.timerProgress = 0;
    this.playbackSubscription = interval(sliceSize).subscribe(() => {
      passed += sliceSize;
      if (passed >= this.playbackDuration) {
        this.playbackSubscription?.unsubscribe();
        this.next();
      }
      const animationDelayOffset = 250;
      this.timerProgress = Math.ceil(passed / (this.playbackDuration - animationDelayOffset) * 100);
    });
  }

  public open(imageId: string): { afterClose: (cbk: CallbackFn) => void } {
    const idx = this.images.findIndex(image => image.id === imageId);
    this.visible = true;
    this.showImage(idx ?? 0);
    GalleryFullscreenComponent.disableScrolling();
    this.bindKeyboardInputHandling();
    this.bindMouseInputHandling();

    return {
      afterClose: (cbk: CallbackFn) => {
        this.afterCloseCallback = cbk;
      }
    }
  }

  public close() {
    this.destroy();
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

  public changePlaybackSpeedClicked($event: MouseEvent, amount: number): void {
    $event.stopImmediatePropagation();
    const duration = this.playbackDuration + amount;
    this.playbackDuration = Math.max(this.MIN_DURATION, duration);
  }

  private destroy() {
    this.pausePlayback();
    this.visible = false;
    GalleryFullscreenComponent.enableScrolling();
    this.unsubscribeAll();

    this.afterCloseCallback?.call(this);
    this.afterCloseCallback = undefined;
  }

  private showImage(imageIdx: number) {
    this.activeImageIdx = Math.max(0, Math.min(imageIdx, this.images.length - 1));
    this.image = this.images[imageIdx];
  }

  private bindMouseInputHandling(): void {
    this.showControlsSubscription?.unsubscribe();

    this.showControlsSubscription =
      fromEvent(document, 'mousemove').pipe(
        tap(() => this.showControls = true),
        map(event => {
          if (event === null) {
            return 'queue-hide';
          }
          // Do not trigger hide after X seconds if cursor is on a control element
          return (event.target as HTMLElement)?.closest(".hide-top,.hide-bottom") === null ? 'queue-hide' : 'no-queue-hide';
        }),
        switchMap((mode) => mode === 'queue-hide' ? timer(this.CONTROLS_HIDE_DELAY) : of()),
        startWith(null)
      ).subscribe((status) => {
        this.showControls = false;
        //this.showControls = true;
      });

  }

  private bindKeyboardInputHandling(): void {
    this.keyHandlingSubscription?.unsubscribe();
    this.swipeHandlingSubscription?.unsubscribe();

    this.swipeHandlingSubscription = zip(
      fromEvent<TouchEvent>(document, 'touchstart'),
      fromEvent<TouchEvent>(document, 'touchend')
    ).pipe(
      map(zipped => GalleryFullscreenComponent.getDistance(zipped[0], zipped[1])),
      map(deltas => this.mapToSwipeType(deltas.x, deltas.y)),
      filter(value => value !== null)
    ).subscribe((swipeKind) => {
      switch (swipeKind) {
        case "left":
          this.next();
          break;
        case "right":
          this.previous();
          break;
      }
    });

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
          if (this.isPlaying) {
            this.pausePlayback();
          } else {
            this.startPlayback()
          }
          break;
      }
    });
  }

  private mapToSwipeType(deltaX: number, deltaY: number) {
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
      return deltaX < 0 ? 'right' : 'left';
    }
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.SWIPE_THRESHOLD) {
      return deltaY < 0 ? 'down' : 'up';
    }
    return null;
  }

  private unsubscribeAll(): void {
    this.keyHandlingSubscription?.unsubscribe();
    this.swipeHandlingSubscription?.unsubscribe();
    this.playbackSubscription?.unsubscribe();
    this.showControlsSubscription?.unsubscribe();
  }
}
