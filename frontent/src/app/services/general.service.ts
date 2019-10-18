import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private username: string;

  constructor() {
    this.username = environment.user;
  }

  get user(): string {
    return this.username;
  }

  set user(username: string) {
    this.username = username;
  }
}
