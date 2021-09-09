import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateFoundationPageRoutingModule } from './update-foundation-routing.module';

import { UpdateFoundationPage } from './update-foundation.page';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdateFoundationPageRoutingModule
  ],
  declarations: [UpdateFoundationPage,
    FormatFileSizePipe]
})
export class UpdateFoundationPageModule {}
