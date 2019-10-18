import { Component, OnInit, OnDestroy } from '@angular/core';
import { Howl } from 'howler';
import { AudioRecordingService } from '../voice/services/audio-recording.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent implements OnInit, OnDestroy {
  isRecording = false;
  recordedTime;
  blobUrl;
  loading = false;

  a1saldo = new Howl({ src: ['assets/audios/1saldo.mp3'] });
  a2validar = new Howl({ src: ['assets/audios/2validar.mp3'] });
  a3validando = new Howl({ src: ['assets/audios/3validando.mp3'] });
  a4exito = new Howl({ src: ['assets/audios/4exito.mp3'] });
  a5fallo = new Howl({ src: ['assets/audios/5fallo.mp3'] });

  count = 0;

  constructor(private audioRecordingService: AudioRecordingService, private generalService: GeneralService) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getLoading().subscribe((status) => {
      this.loading = status;
      this.blobUrl = null;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = true;
    });

    this.audioRecordingService.getResponseCheckVoice().subscribe((data) => {
      this.validateVoice(data);
    });
  }

  ngOnInit() {
    this.count = 0;
  }

  allStop() {
    this.a1saldo.stop();
    this.a2validar.stop();
    this.a3validando.stop();
    this.a4exito.stop();
    this.a5fallo.stop();
  }

  changeRecording() {
    this.isRecording = !this.isRecording;
    if (!this.isRecording) {
      this.allStop();
      this.count++;
      console.log(this.count);
      switch (this.count) {
        case 1:
          this.a1saldo.play();
          break;

        case 2:
          this.a2validar.play();
          break;

        case 3:
          this.stopRecording();
          this.a3validando.play();
          this.count = 1;
          break;
      }
    } else {
      if (this.count === 2) {
        this.startRecording();
      }
    }
  }

  validateVoice(user) {
    console.log('USER: ', user);
    if (user === this.generalService.user) {
      this.a4exito.play();
    } else {
      this.a5fallo.play();
    }
  }


  startRecording() {
    this.audioRecordingService.startRecording();
  }

  abortRecording() {
    this.audioRecordingService.abortRecording();
  }

  stopRecording() {
    this.audioRecordingService.stopRecording('recognition');
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
