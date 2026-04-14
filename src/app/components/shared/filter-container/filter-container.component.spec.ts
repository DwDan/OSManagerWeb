import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterContainerComponent } from './filter-container.component';

@Component({
  template: `
    <ng-template #contentTemplate>
      <div>Conteúdo teste</div>
    </ng-template>

    <app-filter-container
      [title]="'Título'"
      [clearLabel]="'Limpar'"
      [filterLabel]="'Filtrar'"
      [slide]="false"
      [contentTemplate]="contentTemplate"
    >
    </app-filter-container>
  `,
  imports: [FilterContainerComponent],
})
class HostComponent {
  @ViewChild('contentTemplate', { static: true })
  contentTemplate!: TemplateRef<unknown>;
}

describe('FilterContainerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });
});
