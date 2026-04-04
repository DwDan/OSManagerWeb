import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaterOrderComponent } from './creater-order.component';

describe('CreaterOrderComponent', () => {
  let component: CreaterOrderComponent;
  let fixture: ComponentFixture<CreaterOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaterOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaterOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
