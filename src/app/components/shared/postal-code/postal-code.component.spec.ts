import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PostalCodeComponent } from './postal-code.component';

describe('PostalCodeComponent', () => {
  let component: PostalCodeComponent;
  let fixture: ComponentFixture<PostalCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostalCodeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PostalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
