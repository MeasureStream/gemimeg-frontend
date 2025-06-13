/**
 *  Copyright 2025 Physikalisch-Technische Bundesanstalt
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *  may be used to endorse or promote products derived from this software without
 *  specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 *  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 *  OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-richcontent',
  templateUrl: './dcc-richcontent.component.html',
  styleUrls: ['./dcc-richcontent.component.scss'],
})
export class DccRichContentComponent implements OnInit {
  @Input() richContent: RichContentDto | any;
  @Output() fileSelected = new EventEmitter<ByteDataDto>();

  showLanguageComponent = false;
  showFileComponent = false;
  showMathmlComponent = false;
  languageItems: any[] = [];

  constructor(private initializationService: InitializationService) {}

  onFileSelected(fileData: ByteDataDto) {
    this.fileSelected.emit(fileData);
  }

  ngOnInit(): void {
    if (!this.richContent) {
      this.richContent = this.initializationService.getEmptyRichContentDto();
    }
  }

  toggleComponent(component: string) {
    switch (component) {
      case 'language':
        this.showLanguageComponent = !this.showLanguageComponent;
        break;
      case 'file':
        this.showFileComponent = !this.showFileComponent;
        break;
      case 'mathml':
        this.showMathmlComponent = !this.showMathmlComponent;
        break;
    }
  }
}
