import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from '../services/alert.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const alertService = inject(AlertService);

  return next(req).pipe(
    tap(() => {},
      (error: HttpErrorResponse) => {
        alertService.showError(getStatusCodeLegend(error.status));
      }
    )
  );
};

function getStatusCodeLegend(statusCode: number): string {
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
