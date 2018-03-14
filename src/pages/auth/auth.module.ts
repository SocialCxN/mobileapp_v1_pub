import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthPage } from './auth';
import { ForgotPasswordPage } from './forgot-password/forgot-password';
import { AuthProvider } from '../../providers/auth/auth';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule    } from '@ionic/storage';
import { EqualValidator } from '../../shared/directives/equal-validator.directive';
import { ValidateOnBlurDirective } from '../../shared/directives/validate-onblur.directive'
import { LoaderComponent } from '../../shared/loader/loader';

@NgModule({
  declarations: [
    AuthPage,
    EqualValidator,
    ValidateOnBlurDirective
  ],
  imports: [
    BrowserModule,
    IonicPageModule.forChild(AuthPage)
  ],
  providers: [
    AuthProvider,
    LoaderComponent
  ]
})
export class AuthPageModule {}
