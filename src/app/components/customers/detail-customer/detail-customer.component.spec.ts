import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersService } from '@services/customers/customers.service';
import { of } from 'rxjs';
import { DetailCustomerComponent } from './detail-customer.component';

describe('DetailCustomerComponent', () => {
  let component: DetailCustomerComponent;
  let fixture: ComponentFixture<DetailCustomerComponent>;

  const customersServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        id: 'customer-1',
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCustomerComponent],
      providers: [{ provide: CustomersService, useValue: customersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCustomerComponent);
    component = fixture.componentInstance;
    component.data = { customerId: 'customer-1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
