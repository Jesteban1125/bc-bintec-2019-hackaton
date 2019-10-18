import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
  }

  changeUsername(username) {
    this.generalService.user = username;
  }

}
