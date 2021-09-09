import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateUserPageRoutingModule } from './update-user-routing.module';

import { UpdateUserPage } from './update-user.page';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdateUserPageRoutingModule
  ],
  declarations: [UpdateUserPage,
    FormatFileSizePipe]
})
export class UpdateUserPageModule {}
