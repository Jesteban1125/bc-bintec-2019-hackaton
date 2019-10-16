import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {WebcamModule} from 'ngx-webcam';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { VoiceComponent } from './components/voice/voice.component';
import { FaceComponent } from './components/face/face.component';
import { HomeComponent } from './components/home/home.component';
import { SharedPaymentComponent } from './components/shared-payment/shared-payment.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { LockComponent } from './components/lock/lock.component';
import { FloatButtonComponent } from './components/shared/float-button/float-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OnboardingComponent,
    VoiceComponent,
    FaceComponent,
    HomeComponent,
    SharedPaymentComponent,
    WishListComponent,
    LockComponent,
    FloatButtonComponent
  ],
  imports: [
    MatButtonModule,
    WebcamModule,
    BrowserModule,
    FlexLayoutModule,
    MatStepperModule,
    MatIconModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
