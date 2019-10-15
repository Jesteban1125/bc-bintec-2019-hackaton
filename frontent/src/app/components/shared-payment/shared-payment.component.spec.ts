import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPaymentComponent } from './shared-payment.component';

describe('SharedPaymentComponent', () => {
  let component: SharedPaymentComponent;
  let fixture: ComponentFixture<SharedPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
