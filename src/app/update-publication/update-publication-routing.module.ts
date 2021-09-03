import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePublicationPage } from './update-publication.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePublicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePublicationPageRoutingModule {}
