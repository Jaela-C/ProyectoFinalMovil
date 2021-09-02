import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateFoundationPage } from './update-foundation.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateFoundationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateFoundationPageRoutingModule {}
