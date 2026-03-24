import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PoI18nModule, PoI18nPipe, PoModule } from '@po-ui/ng-components';
import { PoPageLoginModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoModule,
    PoI18nModule,
    PoPageLoginModule,
    LoginRoutingModule,
    PoTemplatesModule,
  ],
  providers: [PoI18nPipe],
})
export class LoginModule {}
