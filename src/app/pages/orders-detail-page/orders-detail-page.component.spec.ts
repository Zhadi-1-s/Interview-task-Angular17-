import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDetailPageComponent } from './orders-detail-page.component';

describe('OrdersDetailPageComponent', () => {
  let component: OrdersDetailPageComponent;
  let fixture: ComponentFixture<OrdersDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
