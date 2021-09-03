import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPublicationPage } from './register-publication.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPublicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPublicationPageRoutingModule {}
