import { Component, OnDestroy } from '@angular/core';
import { AudioRecordingService } from './services/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnDestroy {
  isRecording = false;
  recordedTime;
  blobUrl;
  loading = false;
  steps;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

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
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      if (this.steps[0] && this.steps[1] && !this.steps[2]) {
        this.steps[2] = 1;
      }
      if (this.steps[0] && !this.steps[1]) {
        this.steps[1] = 1;
      }
      if (!this.steps[0]) {
        this.steps[0] = 1;
      }
    });

    this.steps = [0, 0, 0];
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
