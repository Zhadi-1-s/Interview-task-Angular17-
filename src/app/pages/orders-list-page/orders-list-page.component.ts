import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable,combineLatest,map,startWith, tap,takeUntil } from 'rxjs';
import { OrdersService } from '../../core/services/order/order.service';
import { Order } from '../../core/interfaces/order.interface';
import { MatSortModule } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    RouterLink],
  templateUrl: './orders-list-page.component.html',
  styleUrl: './orders-list-page.component.scss'
})
export class OrdersListPageComponent implements OnInit, OnDestroy {
  displayedColumns = ['number', 'customer', 'status', 'total', 'date'];

  statusFilter = new FormControl('');
  customerFilter = new FormControl('');
  sortOrder = new FormControl<'asc' | 'desc'>('asc');

  orders$ = this.orderService.orders$;
  filteredOrders$!: Observable<Order[]>;

  totalOrders = 0;
  pageSize = 5;
  currentPage = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.statusFilter.setValue(params['status'] || '', { emitEvent: false });
        this.customerFilter.setValue(params['customer'] || '', { emitEvent: false });
        this.sortOrder.setValue(params['sort'] || 'asc', { emitEvent: false });
        this.currentPage = +params['page'] || 0;
        this.pageSize = +params['pageSize'] || 5;
      });

    // Загружаем заказы (кэширование в сервисе)
    this.orderService.getOrders().subscribe();

    // Обновляем URL при изменении фильтров/сортировки
    combineLatest([
      this.statusFilter.valueChanges.pipe(startWith(this.statusFilter.value)),
      this.customerFilter.valueChanges.pipe(startWith(this.customerFilter.value)),
      this.sortOrder.valueChanges.pipe(startWith(this.sortOrder.value))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([status, customer, sort]) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { status, customer, sort, page: this.currentPage, pageSize: this.pageSize },
          queryParamsHandling: 'merge'
        });
      });

    // Основная фильтрация + сортировка + пагинация
    this.filteredOrders$ = combineLatest([
      this.orders$.pipe(map(o => o ?? [])),
      this.statusFilter.valueChanges.pipe(startWith(this.statusFilter.value)),
      this.customerFilter.valueChanges.pipe(startWith(this.customerFilter.value)),
      this.sortOrder.valueChanges.pipe(startWith(this.sortOrder.value))
    ]).pipe(
      map(([orders, status, customer, sort]) => {
        let filtered = orders.filter(order => {
          const matchesStatus = status ? order.status === status : true;
          const matchesCustomer = customer ? order.customerName.toLowerCase().includes(customer.toLowerCase()) : true;
          return matchesStatus && matchesCustomer;
        });

        filtered.sort((a, b) => sort === 'asc' ? a.total - b.total : b.total - a.total);

        this.totalOrders = filtered.length;

        return filtered.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
      })
    );
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    // Обновляем queryParams при смене страницы
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
