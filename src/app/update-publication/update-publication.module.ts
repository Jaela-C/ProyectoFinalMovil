import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePublicationPageRoutingModule } from './update-publication-routing.module';

import { UpdatePublicationPage } from './update-publication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdatePublicationPageRoutingModule
  ],
  declarations: [UpdatePublicationPage]
})
export class UpdatePublicationPageModule {}
