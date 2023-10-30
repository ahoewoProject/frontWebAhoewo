import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PersonneService } from '../services/gestionDesComptes/personne.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private personneService: PersonneService) {}

  // Fonction pour intercepter une requête sortante
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url === 'https://www.primefaces.org/cdn/api/upload.php') {
      return next.handle(request);
    }

    const access_token = this.personneService.recupererAccessToken();
    if (access_token !== null) {
      let clone = this.ajouterAuthorization(request, access_token);

      return next.handle(clone).pipe(
        catchError(error => {
          if (error.status === 403) {
            this.personneService.deconnexion();
          }
          return throwError(error);
        }),
      );
    }
    return next.handle(request);
  }

  // Fonction pour ajouter des entêtes aux requêtes sortantes
  private ajouterAuthorization(request: HttpRequest<unknown>, access_token: string): HttpRequest<unknown> {
    return request.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
      }),
    });
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
