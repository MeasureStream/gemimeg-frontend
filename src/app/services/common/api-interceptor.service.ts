import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl = (import.meta as any).env?.VITE_API_URL || '';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only modify requests that start with /api/ (relative API calls)
    if (request.url.startsWith('/api/') && this.apiUrl) {
      const apiReq = request.clone({
        url: `${this.apiUrl}${request.url}`
      });
      return next.handle(apiReq);
    }

    return next.handle(request);
  }
}