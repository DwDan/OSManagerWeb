import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddEvidenceComponent } from './add-evidence.component';

describe('AddEvidenceComponent', () => {
  let component: AddEvidenceComponent;
  let fixture: ComponentFixture<AddEvidenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEvidenceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
