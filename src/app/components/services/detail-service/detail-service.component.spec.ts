import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesService } from '@services/services/services.service';
import { of } from 'rxjs';
import { DetailServiceComponent } from './detail-service.component';

describe('DetailServiceComponent', () => {
  let component: DetailServiceComponent;
  let fixture: ComponentFixture<DetailServiceComponent>;

  const servicesServiceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(
      of({
        id: 'service-1',
        name: 'Serviço Teste',
        amountToReceive: 100,
        amountToPay: 50,
      }),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailServiceComponent],
      providers: [{ provide: ServicesService, useValue: servicesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailServiceComponent);
    component = fixture.componentInstance;
    component.data = { serviceId: 'service-1' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
