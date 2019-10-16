import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import * as AWS from 'aws-sdk';
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
  private AWSService = AWS;
  private s3;

  constructor() {
    this.settingAWS();
  }

  settingAWS() {
    this.AWSService.config.update({
      region: environment.region,
      credentials: new this.AWSService.CognitoIdentityCredentials({
        IdentityPoolId: environment.IdentityPoolId
      })
    });
    this.s3 = new this.AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: environment.bucketName }
    });
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
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

  stopRecording() {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
          this.addPhoto(blob);
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next();
      });
    }
  }

  private addPhoto(file) {
    // this.s3.upload({ Key: file.name, Bucket: bucketName, Body: file, ACL: 'public-read' }, function (err, data) {
    //   if (err) {
    //     console.log(err, 'there was an error uploading your file');
    //   }
    // });

    // const upload = this.s3.upload({
    //   params: {
    //     Bucket: environment.bucketName,
    //     Key: 'juanes',
    //     Body: file,
    //     ACL: 'public-read'
    //   }
    // }, (err, data) => {
    //   console.log()
    // });

    console.log(file);
    const upload = new this.AWSService.S3.ManagedUpload({
      params: {
        Bucket: environment.bucketName,
        Key: 'juanes.mp3',
        Body: file,
        ACL: 'public-read'
      }
    });

    const promise = upload.promise();

    promise.then(
      data => {
        console.log('Successfully uploaded photo.');
      },
      err => {
        return console.error('There was an error uploading your photo: ', err.message);
      }
    );
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
