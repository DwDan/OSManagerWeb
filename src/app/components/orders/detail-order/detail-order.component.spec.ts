import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { OrdersService } from '@services/orders/orders.service';
import { DetailOrderComponent } from './detail-order.component';

describe('DetailOrderComponent', () => {
  let component: DetailOrderComponent;
  let fixture: ComponentFixture<DetailOrderComponent>;

  const ordersServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        id: 'order-1',
        code: 'OS-001',
        status: 0,
        executionResult: null,
        customer: {
          id: 'customer-1',
          name: 'Cliente Teste',
        },
        technician: null,
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
        services: [
          {
            id: 'service-1',
            name: 'Serviço Teste',
          },
        ],
        evidences: [],
      }),
    ),
    downloadEvidence: jasmine.createSpy('downloadEvidence').and.returnValue(of(new Blob())),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailOrderComponent],
      providers: [{ provide: OrdersService, useValue: ordersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailOrderComponent);
    component = fixture.componentInstance;
    component.data = { orderId: 'order-1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
