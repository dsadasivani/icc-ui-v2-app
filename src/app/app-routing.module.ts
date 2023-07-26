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
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        data: {
          page: 'CREATE',
        },
      },
      {
        path: 'update-order',
        component: CreateOrderComponent,
        data: {
          page: 'UPDATE',
        },
      },
      {
        path: 'inventory',
        component: UnderProgressComponent,
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
