import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpParams, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  constructor(private http: HttpClient) { }

  addPhoto(url: string, file: any, fileName?: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, `${fileName}-${new Date().getTime()}.jpg`);

    if (fileName) {
      formData.append('name', fileName);
    }
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    console.log('req: ', req);
    return this.http.request(req);
  }
}
