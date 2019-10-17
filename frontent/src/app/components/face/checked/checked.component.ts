import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-checked[isChecked]',
  templateUrl: './checked.component.html',
  styleUrls: ['./checked.component.scss']
})
export class CheckedComponent implements OnInit {
  @Input() isChecked: boolean;

  constructor() { }

  ngOnInit() {
  }

}
