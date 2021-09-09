import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAdminPageRoutingModule } from './register-admin-routing.module';

import { RegisterAdminPage } from './register-admin.page';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterAdminPageRoutingModule
  ],
  declarations: [RegisterAdminPage,
    FormatFileSizePipe]
})
export class RegisterAdminPageModule {}
