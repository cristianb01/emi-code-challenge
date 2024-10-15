import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CustomHttpInterceptor implements HttpInterceptor {
  
  private alertService = inject(AlertService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
          this.alertService.showError(this.getStatusCodeLegend(err.status));
          
          return next.handle(req.clone());
      })
    ) as any;
  }

  public getStatusCodeLegend(statusCode: number) {
    switch (statusCode) {
      case 404: 
        return 'Could not find data in the server';
      case 403:
        return 'You are not allowed to get this information';
      case 500: 
        return 'An serverside error ocurred';
      default:
        return 'An unexpected error ocurred. Try again later';
    }
  }
}
