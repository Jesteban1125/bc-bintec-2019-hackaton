import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacesTRXService {

  private friends = [
    {name: 'Esteban', id: '1122334455', date: '01/10/2019', value: '10000'},
    {name: 'Daniel', id: '1122334466', date: '01/10/2019', value: '10000'},
    {name: 'Santi', id: '1122334477', date: '01/10/2019', value: '10000'},
    {name: 'Gioo', id: '1122334488', date: '01/10/2019', value: '10000'}
  ]

  constructor() { }

  public getFriends() {
    return this.friends;
  }

}
