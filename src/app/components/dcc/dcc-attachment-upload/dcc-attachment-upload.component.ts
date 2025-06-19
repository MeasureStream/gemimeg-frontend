import { Component, EventEmitter, Output } from '@angular/core';

import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

@Component({
  selector: 'app-dcc-attachment-upload',
  templateUrl: './dcc-attachment-upload.component.html',
  styleUrls: ['./dcc-attachment-upload.component.scss'],
})
export class DccAttachmentUploadComponent {
  @Output() fileSelected = new EventEmitter<ByteDataDto>();

  constructor() {}

  async onChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const binary = await this.readFile(file);
      const byteData = {
        content: this.arrayBufferToBase64(binary),
        mimeType: file.type,
        fileName: file.name,
      };
      this.fileSelected.emit(byteData);
    }
  }

  readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(file);
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

