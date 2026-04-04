import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServiceComponent } from './detail-service.component';

describe('DetailServiceComponent', () => {
  let component: DetailServiceComponent;
  let fixture: ComponentFixture<DetailServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
