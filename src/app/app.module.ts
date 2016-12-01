import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [ AppComponent ],
  imports: [
    SharedModule,
    HomeModule,
    AppRoutingModule
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
