import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import {DccService} from './dcc.service';

describe('DccService', () => {
  let service: DccService;

  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  let logger: NGXLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DccService,
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get']) },
        NGXLogger
      ],
      imports: [ 
        HttpClientTestingModule,
        LoggerTestingModule 
      ],
      //declarations: [ DccService ]
    });
    
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    logger = TestBed.inject(NGXLogger);
    service = TestBed.inject(DccService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExampleDcc(): should return local testdata (HttpClient called once)', (done: DoneFn) => {

    httpClientSpy.get.and.returnValue(of("test"));

    service.getExampleDcc("assets/Thementag.xml").subscribe({
      next: response  => {
        expect(response)
          .withContext('expected')
          .toEqual("test");
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.get.calls.count())
      .withContext('one call')
      .toBe(1);
  });

});
