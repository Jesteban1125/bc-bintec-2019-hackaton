import { Subject } from 'rxjs/internal/Subject';
import { Component, OnInit } from '@angular/core';
import { WebcamUtil, WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs/internal/Observable';
import { FaceService } from './services/face.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { GeneralService } from 'src/app/services/general.service';

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

  constructor(private _faceService: FaceService, private generalService: GeneralService) { }

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
    setTimeout(async () => {
      console.log('received webcam image', webcamImage);
      const blob = await fetch(webcamImage.imageAsDataUrl).then(res => res.blob());

      console.log('blob: ', blob);

      this._faceService.addPhoto('http://34.206.72.191:5000/ftrain', blob, this.generalService.user)
        .subscribe(
          event => {
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`File is ${percentDone}% loaded.`);
            } else if (event instanceof HttpResponse) {
              console.log('File is completely loaded!');
            }
          },
          (err) => {
            console.log('Upload Error:', err);
            if (err.status === 200) {
              // this._loading.next(false);
            }
          }, () => {
            console.log('Upload done');
          }
        );

      // fetch(webcamImage.imageAsDataUrl)
      //   .then(res => {
      //     const asd = res.blob();
      //     console.log(asd);
      //     this._faceService.addPhoto('http://34.206.72.191:5000/ftrain', asd, `${ this.generalService.user}_${new Date().getTime()}.jpg`)
      //       .subscribe(
      //         event => {
      //           if (event.type == HttpEventType.UploadProgress) {
      //             const percentDone = Math.round(100 * event.loaded / event.total);
      //             console.log(`File is ${percentDone}% loaded.`);
      //           } else if (event instanceof HttpResponse) {
      //             console.log('File is completely loaded!');
      //           }
      //         },
      //         (err) => {
      //           console.log('Upload Error:', err);
      //           if (err.status === 200) {
      //             // this._loading.next(false);
      //           }
      //         }, () => {
      //           console.log('Upload done');
      //         }
      //       );
      //   }
      // );
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
