import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileUserPageRoutingModule } from './profile-user-routing.module';

import { ProfileUserPage } from './profile-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfileUserPageRoutingModule
  ],
  declarations: [ProfileUserPage]
})
export class ProfileUserPageModule {}
