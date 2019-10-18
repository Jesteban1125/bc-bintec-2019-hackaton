import { FacesTRXService } from './../../services/faces-trx.service';
import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamUtil, WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { Location } from '@angular/common';
import { FaceService } from '../face/services/face.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

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
  public totalValue: number;

  constructor(private location: Location,
              private serviceFace: FacesTRXService,
              private _faceService: FaceService) { }

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
    // this.faces = this.serviceFace.getFriends();

    setTimeout(async () => {
      const blob = await fetch(webcamImage.imageAsDataUrl).then(res => res.blob());
      console.log(this.totalValue);

      console.log('blob: ', blob);

      this._faceService.addPhoto('http://34.206.72.191:5000/frecognition', blob)
        .subscribe(
          event => {
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`File is ${percentDone}% loaded.`);
            } else if (event instanceof HttpResponse) {
              console.log('File is completely loaded!');
              // console.log(event.body.people.split('_'));
              this.faces = event.body.people.map(item => {
                return {
                  name: item.split('_')[0],
                  value: this.totalValue / event.body.people.length,
                  date: new Date()
                };
              });
              console.log(this.faces);
            }
          },
          (err) => {
            console.log('Upload Error:', err);
            if (err.status === 200) {
              // this.faces = [];
              // this._loading.next(false);
            }
          }, () => {
            console.log('Upload done');
          }
        );
    }, 0);


    console.log(this.faces);
    setTimeout(() => {
      this.isPictureTaken = true;
    }, 1500);
  }

  navigateBack() {
    this.location.back();
  }

}
