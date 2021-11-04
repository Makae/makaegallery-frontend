import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {HttpClientModule} from '@angular/common/http';
import {LoginButtonComponent} from './components/login/login-button/login-button.component';
import {LoginDialogComponent} from './components/login/login-dialog/login-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {InputComponent} from './shared/components/input/input.component';
import {FormComponent} from './shared/components/form/form.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SpinnerComponent} from './shared/components/spinner/spinner.component';
import {GalleryListingComponent} from './components/gallery/gallery-listing/gallery-listing.component';
import {GalleryMasonryComponent} from './components/gallery/gallery-masonry/gallery-masonry.component';
import {MatCardModule} from '@angular/material/card';
import {HeaderComponent} from './components/header/header.component';
import {GalleryFullscreenComponent} from './components/gallery/gallery-fullscreen/gallery-fullscreen.component';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    InputComponent,
    LoginButtonComponent,
    LoginDialogComponent,
    SpinnerComponent,
    GalleryListingComponent,
    GalleryMasonryComponent,
    GalleryFullscreenComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
