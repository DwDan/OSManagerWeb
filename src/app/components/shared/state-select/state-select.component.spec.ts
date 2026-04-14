import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateSelectComponent } from './state-select.component';

describe('StateSelectComponent', () => {
  let component: StateSelectComponent;
  let fixture: ComponentFixture<StateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateSelectComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
