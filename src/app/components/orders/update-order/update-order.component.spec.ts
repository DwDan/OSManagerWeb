import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { OrdersService } from '@services/orders/orders.service';
import { ServicesService } from '@services/services/services.service';
import { of } from 'rxjs';
import { UpdateOrderComponent } from './update-order.component';

describe('UpdateOrderComponent', () => {
  let component: UpdateOrderComponent;
  let fixture: ComponentFixture<UpdateOrderComponent>;

  const ordersServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        customer: {
          id: 'customer-1',
        },
        services: [{ id: 'service-1' }],
        scheduledAt: new Date(),
        address: {
          postalCode: '30110-000',
          street: 'Rua Teste',
          number: '123',
          city: 'Belo Horizonte',
          state: 'MG',
          country: 'Brasil',
          complement: '',
          reference: '',
        },
      }),
    ),
    update: jasmine.createSpy('update').and.returnValue(of({})),
  };

  const customersServiceMock = {
    getAllCustomers: jasmine.createSpy('getAllCustomers').and.returnValue(
      of([
        {
          id: 'customer-1',
          name: 'Cliente Teste',
        },
      ]),
    ),
  };

  const servicesServiceMock = {
    getAllServices: jasmine.createSpy('getAllServices').and.returnValue(
      of([
        {
          id: 'service-1',
          name: 'Serviço Teste',
        },
      ]),
    ),
  };

  const poNotificationServiceMock = {
    success: jasmine.createSpy('success'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OrdersService, useValue: ordersServiceMock },
        { provide: CustomersService, useValue: customersServiceMock },
        { provide: ServicesService, useValue: servicesServiceMock },
        { provide: PoNotificationService, useValue: poNotificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateOrderComponent);
    component = fixture.componentInstance;
    component.data = { orderId: 'order-1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
