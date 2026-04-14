import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DetailOrderComponent } from './detail-order.component';

describe('DetailOrderComponent', () => {
  let component: DetailOrderComponent;
  let fixture: ComponentFixture<DetailOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailOrderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
