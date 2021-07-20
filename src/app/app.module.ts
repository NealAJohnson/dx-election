import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { DxButtonModule,
         DxChartModule,
         DxScrollViewModule,
         DxVectorMapModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
      BrowserModule,
      DxVectorMapModule,
      DxChartModule,
      DxButtonModule,
      DxScrollViewModule,
      HttpClientModule
  ],
  declarations: [
    AppComponent,
    MapComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
