import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { of } from 'rxjs';
import { UpdateCustomerComponent } from './update-customer.component';

describe('UpdateCustomerComponent', () => {
  let component: UpdateCustomerComponent;
  let fixture: ComponentFixture<UpdateCustomerComponent>;

  const customersServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        name: 'Cliente Teste',
        phone: '31999999999',
        email: 'teste@teste.com',
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

  const poNotificationServiceMock = {
    success: jasmine.createSpy('success'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCustomerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CustomersService, useValue: customersServiceMock },
        { provide: PoNotificationService, useValue: poNotificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCustomerComponent);
    component = fixture.componentInstance;
    component.data = { customerId: 'customer-1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
