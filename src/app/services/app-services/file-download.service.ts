import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FileDownloadService {
  downloadFile(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Only set download attribute if filename is provided
    // If empty or not provided, browser will use server's filename
    if (filename) {
      link.download = filename;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getFileNameFromResponse(response: HttpResponse<Blob>): string {
    // Log headers for debugging
    console.log('Response headers:', response.headers.keys());

    const contentDisposition = response.headers.get('content-disposition');
    console.log('Content-Disposition header:', contentDisposition);

    if (contentDisposition) {
      // First try to match filename*= (RFC 5987) for Unicode filenames
      let fileNameMatch = contentDisposition.match(
        /filename\*=(?:UTF-8'')?([^;]+)/i
      );

      if (fileNameMatch && fileNameMatch[1]) {
        try {
          return decodeURIComponent(fileNameMatch[1]);
        } catch {
          return fileNameMatch[1];
        }
      }

      // Then try regular filename=
      fileNameMatch = contentDisposition.match(
        /filename=["']?([^"';\n]+)["']?/i
      );

      if (fileNameMatch && fileNameMatch[1]) {
        return fileNameMatch[1];
      }
    }

    // Generate filename based on content type
    const extension = this.getFileExtension(response.body!);
    return `gcc_report_${new Date().getTime()}${extension}`;
  }

  getFileExtension(blob: Blob): string {
    switch (blob.type) {
      case 'application/x-zip-compressed':
      case 'application/zip':
        return '.zip';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return '.xlsx';
      case 'application/pdf':
        return '.pdf';
      default:
        return '';
    }
  }

  // Optional: Add error handling
  downloadFileWithErrorHandling(blob: Blob, filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.downloadFile(blob, filename);
        resolve();
      } catch (error) {
        console.error('Error downloading file:', error);
        reject(error);
      }
    });
  }
}
