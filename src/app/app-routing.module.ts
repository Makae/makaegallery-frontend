import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GalleryListingComponent} from './components/gallery/gallery-listing/gallery-listing.component';
import {GalleryMasonryComponent} from './components/gallery/gallery-masonry/gallery-masonry.component';

const routes: Routes = [
  {path: 'gallery/:galleryId', component: GalleryMasonryComponent},
  {path: '', component: GalleryListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
