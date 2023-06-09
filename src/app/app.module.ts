import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { MarkerService } from './services/marker.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapContainerComponent } from './components/map-container/map-container.component';
import { MapFileUploadComponent } from './components/map-file-upload/map-file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    MapContainerComponent,
    MapFileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FileUploadModule
  ],
  providers: [MarkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
