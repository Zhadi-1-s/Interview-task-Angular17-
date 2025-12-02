import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrdersService } from '../../core/services/order/order.service';
import { Order } from '../../core/interfaces/order.interface';
import { Product } from '../../core/interfaces/product.interface';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './orders-detail-page.component.html',
  styleUrl: './orders-detail-page.component.scss'
})
export class OrdersDetailPageComponent {

  orderForm!: FormGroup;
  orderId!: number;
  order!: Order;
  products: Product[] = [];
  error = '';

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
   
    this.ordersService.getProducts().subscribe(p => (this.products = p));

    this.route.params
      .pipe(
        switchMap(params => {
          this.orderId = +params['id'];
          return this.ordersService.getOrderById(this.orderId);
        }),
        tap(order => {
          if (!order) {
            this.router.navigate(['/orders']);
            return;
          }
          this.order = order;
          this.buildForm(order);
        })
      )
      .subscribe();
  }

  buildForm(order: Order) {
    this.orderForm = this.fb.group({
      customerName: [order.customerName, Validators.required],
      status: [order.status, Validators.required],
      items: this.fb.array(order.items.map(i => this.buildItem(i))),
      total: [{ value: order.total, disabled: true }]
    });

    this.items.controls.forEach(itemCtrl =>
      itemCtrl.valueChanges.subscribe(() => this.updateTotal())
    );
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  buildItem(item: { productId: number; qty: number; price: number }): FormGroup {
    return this.fb.group({
      productId: [item.productId, Validators.required],
      qty: [item.qty, [Validators.required, Validators.min(1)]],
      price: [item.price, [Validators.required, Validators.min(0)]]
    });
  }

  addItem() {
    const newItem = this.buildItem({
      productId: this.products[0].id,
      qty: 1,
      price: 0
    });

    this.items.push(newItem);

    newItem.valueChanges.subscribe(() => this.updateTotal());

    this.updateTotal();
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.updateTotal();
  }

  updateTotal() {
    const total = this.items.value.reduce((sum: number, i: any) => sum + i.qty * i.price, 0);
    this.orderForm.get('total')?.setValue(total, { emitEvent: false });
  }

  save() {
    if (this.orderForm.invalid) return;

    const updatedOrder: Order = {
      ...this.order,
      ...this.orderForm.value,
      total: this.orderForm.get('total')?.value
    };

    const prevOrder = { ...this.order };
    this.order = updatedOrder;

    this.ordersService.updateOrder(updatedOrder).pipe(
      catchError(err => {
    
        this.order = prevOrder;
        this.error = 'Ошибка при сохранении заказа';
        return of(null);
      })
    ).subscribe();
  }

  delete() {
    if (!confirm('Удалить заказ?')) return;

    this.ordersService.deleteOrder(this.order.id).subscribe(() => {
      this.router.navigate(['/orders']);
    });
  }

}
