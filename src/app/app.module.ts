import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Módulos creados
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire' ;
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PublicationComponent } from './component/publication/publication.component';
import { PublicationsadminComponent } from './component/publicationsadmin/publicationsadmin.component';
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [AppComponent, PublicationComponent, PublicationsadminComponent],
  entryComponents: [ PublicationComponent, PublicationsadminComponent],
  imports: [FormsModule, BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
