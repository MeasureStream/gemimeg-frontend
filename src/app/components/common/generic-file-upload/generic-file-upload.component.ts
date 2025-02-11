import { FileUploadService } from 'src/app/services/common/generic-file-upload/file-upload.service';
import { Subject } from 'rxjs';
import { Component, OnInit, Output , EventEmitter,ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';
import { DccService } from 'src/app/services/dcc/dcc.service';

@Component({
  selector: 'app-generic-file-upload',
  templateUrl: './generic-file-upload.component.html',
  styleUrls: ['./generic-file-upload.component.scss'],
})
export class GenericFileUploadComponent implements OnInit {
  files: any = {};
  backendResponse: any;
  selectedFile: File | null = null;
  @Output() fileUpload = new Subject<File>();
  fileData: ByteDataDto = {};
  cacheEnabled = true;
  response: any;
  binary_string: any;

  constructor(private fileUploadService: FileUploadService, private _snackBar: MatSnackBar) {}

  ngOnInit() {}

onFileSelected(event:any){
    const file = event.target.files[0];
    this.cdRef.detectChanges()
    this.selectedFile = file
    if (file) {
      const fileSizeLimit = 4 * 1024 * 1024; // 4MB limit

      if (file.size > fileSizeLimit) {
        alert('Die Dateigröße überschreitet 4 MB. Bitte wählen Sie eine kleinere Datei aus.');
        return;
      }
      this.convertBase64(file).then((base64File) => {
        const fileData: ByteDataDto = {
          fileName: file.name,
          mimeType: file.type,
          content: base64File
        };
        console.log("ByteDataDto emitted:", fileData);
        this.fileSelected.emit(fileData);
      });
    }
  }

  convertBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
      const base64String = window.btoa(binaryString);
      this.files.mimeType = file.type;
      this.files.fileName = file.name;
      this.files.fileContent = base64String;
      this.fileUploadService.uploadFile(this.files, this.cacheEnabled).subscribe({
        next: (res) => {
          this.backendResponse = res;
          this.showSuccessToast();
        },
        error: (err: any) => {
          this.showErrorToast('Error signing/uploading the file. Please try again.');
        },
      });
    };
    reader.readAsArrayBuffer(file);
  }

  onFileDownload() {
    const fullUrl = this.backendResponse.body.retrievalUrl;
    this.fileUploadService.retrieveFile(fullUrl).subscribe({
      next: (res) => {
        let parsedJSON = JSON.parse(res);
        this.backendResponse = parsedJSON;
        this.binary_string = atob(this.backendResponse.fileContent);
        const len = this.binary_string.length;
        const arrayBuffer = new ArrayBuffer(len);
        const bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < len; i++) {
          bytes[i] = this.binary_string.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: this.backendResponse.mimeType });
        let a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = this.backendResponse.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showDownloadToast();
      },
      error: (err: any) => {
        this.showErrorToast('Error downloading the file. Please try again.');
      },
    });
  }

  private showSuccessToast(): void {
    this._snackBar.open('File uploaded successfully!', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-toast'],
    });
  }

  private showErrorToast(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-toast'],
    });
  }

  private showDownloadToast(): void {
    this._snackBar.open('File downloaded successfully!', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-toast'],
    });
  }
}
