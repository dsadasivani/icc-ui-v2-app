import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { UnderProgressComponent } from './components/under-progress/under-progress.component';

const routes: Routes = [
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
        component: UnderProgressComponent,
      },
      {
        path: 'products',
        component: UnderProgressComponent,
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
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
