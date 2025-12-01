import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OrdersListPageComponent } from './pages/orders-list-page/orders-list-page.component';
import { OrderDetailPageComponent } from './pages/order-detail-page/order-detail-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'orders', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'orders',
        component: OrdersListPageComponent,
        canActivate: [authGuard],
    },
    {
        path: 'orders/:id',
        component: OrderDetailPageComponent,
        canActivate: [authGuard],
    },
    { path: '**', component: NotFoundPageComponent },
];
