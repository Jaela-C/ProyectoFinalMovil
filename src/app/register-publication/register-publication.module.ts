import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPublicationPageRoutingModule } from './register-publication-routing.module';

import { RegisterPublicationPage } from './register-publication.page';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterPublicationPageRoutingModule
  ],
  declarations: [RegisterPublicationPage,
    FormatFileSizePipe]
})
export class RegisterPublicationPageModule {}
