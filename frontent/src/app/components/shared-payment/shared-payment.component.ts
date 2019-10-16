import { FacesTRXService } from './../../services/faces-trx.service';
import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamUtil, WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shared-payment',
  templateUrl: './shared-payment.component.html',
  styleUrls: ['./shared-payment.component.scss']
})
export class SharedPaymentComponent implements OnInit {
  private trigger: Subject<void> = new Subject<void>();
  public multipleWebcamsAvailable = false;
  public webcamImage: WebcamImage = null;
  public isPictureTaken = false;
  public faces = null;

  constructor(private location: Location,
              private serviceFace: FacesTRXService) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      console.warn('Camera access was not allowed by user!');
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.isPictureTaken = true;
    this.faces = this.serviceFace.getFriends();
    console.log(this.faces);
  }

  navigateBack() {
    this.location.back();
  }

}
