import { Subject } from 'rxjs/internal/Subject';
import { Component, OnInit } from '@angular/core';
import { WebcamUtil, WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'q';
import { del } from 'selenium-webdriver/http';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FaceComponent implements OnInit {

  private trigger: Subject<void> = new Subject<void>();
  public multipleWebcamsAvailable = false;
  public webcamImage: WebcamImage = null;
  public faces = null;
  public picturesTaken = [false, false, false];
  private count = 0;
  public isLessThanLimit = true;

  constructor() { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.picturesTaken = [false, false, false];
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
    setTimeout(() => {
      console.log('received webcam image', webcamImage);
      console.log(webcamImage.imageAsBase64)
      console.log(webcamImage.imageAsDataUrl)
      this.webcamImage = webcamImage;
      this.picturesTaken[this.count] = true;
      console.log(this.picturesTaken);
      this.count++;
    }, 600);
    setTimeout(() => {
      this.isLessThanLimit = this.count < 3;
    }, 1500);
  }
}
