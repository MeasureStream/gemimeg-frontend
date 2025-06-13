import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private finalEndpoint = '/api/v1/cache';

  constructor(private http: HttpClient) {}

  uploadFile(fileData: ByteDataDto, cacheEnabled: boolean): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const options: Object = {
      headers,
      observe: 'response',
      responseType: 'json',
    };

    return this.http.post<any>(this.finalEndpoint, fileData, options);
  }

  retrieveFile(link: string): Observable<any> {
    return this.http.get<any>(link, { responseType: 'text' as 'json' });
  }
}
