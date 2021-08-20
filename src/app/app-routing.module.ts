import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  //{
  //  path: 'home',
  //  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  //},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [NologinGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [NologinGuard]
  },
  {
    path: 'publications',
    loadChildren: () => import('./publications/publications.module').then( m => m.PublicationsPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'type',
    loadChildren: () => import('./type/type.module').then( m => m.TypePageModule)
  },
  {
    path: 'register-admin',
    loadChildren: () => import('./register-admin/register-admin.module').then( m => m.RegisterAdminPageModule)
  },
  {
    path: 'profile-user',
    loadChildren: () => import('./profile-user/profile-user.module').then( m => m.ProfileUserPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
