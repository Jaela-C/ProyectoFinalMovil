import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePublicationPageRoutingModule } from './update-publication-routing.module';

import { UpdatePublicationPage } from './update-publication.page';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdatePublicationPageRoutingModule
  ],
  declarations: [UpdatePublicationPage,
    FormatFileSizePipe]
})
export class UpdatePublicationPageModule {}
