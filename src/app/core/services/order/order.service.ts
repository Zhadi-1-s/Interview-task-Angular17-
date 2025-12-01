import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Order } from '../../interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private ordersUrl = 'http://localhost:3001/orders';
  private ordersCache$ = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersCache$.asObservable();

  constructor(private http: HttpClient) {}

  getOrders(forceReload = false): Observable<Order[]> {
    if (!forceReload && this.ordersCache$.value.length > 0) {

      return of(this.ordersCache$.value);
    }

    return this.http.get<Order[]>(this.ordersUrl).pipe(
      tap((orders) => {

        this.ordersCache$.next(orders);
      }),
      catchError((err) => {

        return throwError(() => new Error('Failed to load orders'));
      })
    );
  }


  getOrderById(id: number): Observable<Order | undefined> {
    const cached = this.ordersCache$.value?.find((o) => o.id === id);
    if (cached) return of(cached);

    return this.http.get<Order>(`${this.ordersUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Failed to load order'));
      })
    );
  }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order).pipe(
      tap((newOrder) => {
        const current = this.ordersCache$.value ?? [];
        this.ordersCache$.next([...current, newOrder]); 
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Failed to create order'));
      })
    );
  }

  updateOrder(order: Order): Observable<Order> {
    const prevOrders = this.ordersCache$.value ?? [];
    const updatedOrders = prevOrders.map((o) => (o.id === order.id ? order : o));
    this.ordersCache$.next(updatedOrders); 

    return this.http.put<Order>(`${this.ordersUrl}/${order.id}`, order).pipe(
      catchError((err) => {
        console.error(err);
        this.ordersCache$.next(prevOrders); 
        return throwError(() => new Error('Failed to update order'));
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    const prevOrders = this.ordersCache$.value ?? [];
    this.ordersCache$.next(prevOrders.filter((o) => o.id !== id));

    return this.http.delete<void>(`${this.ordersUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(err);
        this.ordersCache$.next(prevOrders); // откат
        return throwError(() => new Error('Failed to delete order'));
      })
    );
  }
}