import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { UnderProgressComponent } from './components/under-progress/under-progress.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { UpdateProfileComponent } from './components/auth/update-profile/update-profile.component';

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'products',
        component: UnderProgressComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [AuthGuard],
        data: {
          page: 'CREATE',
        },
      },
      {
        path: 'update-order',
        component: CreateOrderComponent,
        canActivate: [AuthGuard],
        data: {
          page: 'UPDATE',
        },
      },
      {
        path: 'inventory',
        component: UnderProgressComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        component: AboutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
