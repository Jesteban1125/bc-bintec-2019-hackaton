import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';


interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private stream;
  private recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  private _loading = new Subject<boolean>();
  private _responseCheckVoice = new Subject<string>();

  constructor(private http: HttpClient) { }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  getLoading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  getResponseCheckVoice(): Observable<string> {
    return this._responseCheckVoice.asObservable();
  }

  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });

  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording(type = 'train') {
    if (type === 'train') {
      this._loading.next(true);

      if (this.recorder) {
        this.recorder.stop((blob) => {
          if (this.startTime) {
            // const mp3Name = encodeURIComponent('ferney_' + new Date().getTime() + '.mp3');
            const mp3Name = encodeURIComponent(`${ environment.user }_${ new Date().getTime() }.mp3`);
            this.stopMedia();
            this._recorded.next({ blob, title: mp3Name });
            console.log('blob: ', blob);

            this.addPhoto('http://34.206.72.191:5000/train', blob, mp3Name)
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
                    this._loading.next(false);
                  }
                }, () => {
                  console.log('Upload done');
                }
              );
          }
        }, () => {
          this.stopMedia();
          this._recordingFailed.next();
        });
      }
    } else {
      if (this.recorder) {
        this.recorder.stop((blob) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent('audio_to_validate.mp3');
            this.stopMedia();
            this._recorded.next({ blob, title: mp3Name });
            console.log('blob: ', blob);

            this.addPhoto('http://34.206.72.191:5000/recognition', blob, mp3Name)
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
                    this._loading.next(false);
                    this._responseCheckVoice.next(err.error.text);
                  }
                }, () => {
                  console.log('Upload done');
                }
              );
          }
        }, () => {
          this.stopMedia();
          this._recordingFailed.next();
        });
      }
    }
  }

  private addPhoto(url: string, file: File, mp3Name: string): Observable<HttpEvent<any>> {

    const formData = new FormData();
    formData.append('file', file, mp3Name);
    // formData.append('blob', file);

    // const fileOfBlob = new File([file], 'pepe_2.mp3');
    // formData.append('upload', fileOfBlob);


    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    console.log('req: ', req);
    return this.http.request(req);
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
}
