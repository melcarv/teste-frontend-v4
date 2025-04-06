import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { MapComponent } from './features/map/map.component';
import { EquipmentHistoryComponent } from './features/equipment-history/equipment-history.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EquipmentHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { } 