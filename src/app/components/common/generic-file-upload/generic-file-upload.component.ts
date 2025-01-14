import { FileUploadService } from './file-upload.service';
import { Subject } from 'rxjs';
import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ByteDataDto } from 'src/app/generated/dcc/model/byteDataDto';

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

  onUploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileSizeLimit = 10 * 1024 * 1024; // 10MB limit
      //const fileSizeLimit = 100 * 1024; // 100kb limit
      if (file.size > fileSizeLimit) {
        alert('File size exceeds the limit. Please choose a smaller file.');
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.showErrorToast('No file selected for upload.');
      return;
    }
    this.convertBase64(this.selectedFile);
    this.fileUpload.next(this.selectedFile);
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
      this.files.content = [base64String];
      this.fileUploadService.uploadFile(this.files, this.cacheEnabled).subscribe({
              next: (res) => {
                this.backendResponse = res;
                console.log("backend Response",this.backendResponse);
                this.showSuccessToast();

              },
              error: (err: any) => {
                this.showErrorToast('Error signing/uploading the file. Please try again.');
    };
    reader.readAsArrayBuffer(file);
  }

  onFileDownload() {
    // Get the response payload
    let sealedResponse = this.backendResponse.body.payload;

    // Strip off any Base64 data URL prefix if present
    //sealedResponse = sealedResponse.split(',')[1] || sealedResponse;

    // Decode the Base64 string
    console.log("sealed Response2",sealedResponse);

    let binary_string = '';
    try {
      binary_string = window.atob(sealedResponse);
    } catch (e:any) {
      console.error('Invalid Base64 string:', e.message);
      return;
    }

    // Convert binary string to ArrayBuffer
    const len = binary_string.length;
    const arrayBuffer = new ArrayBuffer(len);
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    // Create a blob with the specified MIME type
    const blob = new Blob([bytes], {
      type: this.backendResponse.body.mimeType,
    });

    // Create a temporary download link
    let a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.backendResponse.body.fileName;
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    a.remove();

    // Optionally, show a download notification
    this.showDownloadToast();
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
          //Blobbinary large objects
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
    this._snackBar.open('File signed and uploaded successfully!', 'Close', {
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
