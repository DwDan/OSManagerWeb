import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize, Observable } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-entity-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-entity-modal.component.html',
})
export class CustomEntityModalComponent
  extends BaseModalComponent<{ item?: CustomEntityResponse }, { confirmed: boolean }>
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    key: [''],
    name: ['', [Validators.required]],
  });

  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.save(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));
  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    if (this.data?.item) {
      this.form.reset({ key: this.data.item.key, name: this.data.item.name });
      this.form.controls.key.setValidators([Validators.required]);
      this.form.controls.key.updateValueAndValidity();
    }
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateCustomEntity(this.data.item.id, rawValue)
      : this.service.createCustomEntity({ name: rawValue.name });

    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(
          this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created,
        );
        this.submit({ confirmed: true });
      },
    });
  }
}
