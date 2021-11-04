import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryListingComponent } from './gallery-listing.component';

describe('GalleryListingComponent', () => {
  let component: GalleryListingComponent;
  let fixture: ComponentFixture<GalleryListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
