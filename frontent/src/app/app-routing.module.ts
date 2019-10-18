import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FaceComponent } from './components/face/face.component';
import { LoginComponent } from './components/login/login.component';
import { LockComponent } from './components/lock/lock.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { SharedPaymentComponent } from './components/shared-payment/shared-payment.component';
import { VoiceComponent } from './components/voice/voice.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { MenuComponent } from './components/menu/menu.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'face', component: FaceComponent },
  { path: 'lock', component: LockComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'shared-payment', component: SharedPaymentComponent },
  { path: 'voice', component: VoiceComponent },
  { path: 'wish-list', component: WishListComponent },
  { path: 'menu', component: MenuComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
