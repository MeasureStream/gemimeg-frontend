import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let dialogSpy: jasmine.SpyObj<MatDialog> 

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        NGXLogger,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
      ],
      imports: [ 
        LoggerTestingModule
      ],
    });
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
