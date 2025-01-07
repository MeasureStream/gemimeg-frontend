import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import { CalibrationCertificateDto } from '../../generated/dcc/model/calibrationCertificateDto';
import { NGXLogger } from 'ngx-logger';
import dccExamples from "./examples";

@Injectable({
  providedIn: 'root'
})
export class DccService {

  private dccServicePath = "/api/v1/dcc/";

  public exampleDccs = dccExamples;

  constructor(private http: HttpClient, private logger: NGXLogger) {
  }

  jsonToXml(dcc: CalibrationCertificateDto) {
    let head = new HttpHeaders();
    head = head.set('Content-Type', 'application/json; charset=utf-8');
    //ugly hack to solve https://github.com/angular/angular/issues/18586
    const options = {responseType: 'text' as 'json', headers: head};
    let result = this.http.post<any>(
      this.dccServicePath + "xsd/dcc/xml",
      dcc,
      options
    );
    return result;
  }

  xmlToJson(dcc: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/xml');
    let result = this.http.post<CalibrationCertificateDto>(
      this.dccServicePath + "xsd/dcc/json",
      dcc,
      {headers: headers}
    );
    return result;
  }

  jsonToHtml(dcc: CalibrationCertificateDto) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let result =  this.http.post<string>(
      this.dccServicePath + "xsd/dcc/html",
      dcc,
      {headers: headers}
    );
    return result;
  }

  getExampleDcc(url: string) {
    return this.http.get(url);
  }

  marshalCustomDate(value: Date): string {
    var result = new Array<String>();
    if (value) {
      result.push(value.getFullYear().toString());
      result.push((value.getMonth()+1).toString());
      result.push(value.getDate().toString());
    }
    // append missing zeros
    for (var i=0; i<result.length;i++) {
      if (result[i].length == 1) {
        result[i] = "0"+result[i];
      }
    }
    return result[0]+"-"+result[1]+"-"+result[2];
  }

  unmarshalCustomDate(customDate: string): FormControl {
    var result = new Date;
    try {
      if (customDate) {
        var strarr = customDate.toString().split('-',3);
        if (strarr.length >= 0) {
          result.setFullYear(parseInt(strarr[0]));
        }
        if (strarr.length >= 1) {
          result.setMonth(parseInt(strarr[1])-1);
        }
        if (strarr.length >= 2) {
          result.setDate(parseInt(strarr[2]));
        }
      }
    }
    catch (e: unknown) {
        this.logger.trace("unmarshalCustomDate::Exception thrown: "+(e as Error).message);
    }
    return new FormControl(result);

  }
}
