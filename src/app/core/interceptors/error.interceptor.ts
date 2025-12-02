import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LoaderService } from "../shared/loader/loader.service";
import { ToastService } from "../shared/toast/toast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.show();

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        
        let msg = 'Неизвестная ошибка';

        if (error.status === 0) msg = 'Нет подключения к серверу';
        else if (error.status >= 500) msg = 'Ошибка сервера';
        else if (error.status === 404) msg = 'Не найдено';
        else msg = error.error?.message || error.message;

        this.toast.error(msg);

        return throwError(() => error);
      }),

      finalize(() => this.loader.hide())
    );
  }
}
