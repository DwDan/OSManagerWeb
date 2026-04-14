import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { ServicesService } from '@services/services/services.service';
import { of } from 'rxjs';
import { UpdateServiceComponent } from './update-service.component';

describe('UpdateServiceComponent', () => {
  let component: UpdateServiceComponent;
  let fixture: ComponentFixture<UpdateServiceComponent>;

  const servicesServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        name: 'Serviço teste',
        amountToReceive: 100,
        amountToPay: 50,
      }),
    ),
    update: jasmine.createSpy('update').and.returnValue(of({})),
  };

  const poNotificationServiceMock = {
    success: jasmine.createSpy('success'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateServiceComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ServicesService, useValue: servicesServiceMock },
        { provide: PoNotificationService, useValue: poNotificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateServiceComponent);
    component = fixture.componentInstance;
    component.data = { serviceId: '1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
