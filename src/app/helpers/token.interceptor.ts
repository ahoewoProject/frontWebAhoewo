import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { PersonneService } from '../services/gestionDesComptes/personne.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private personneService: PersonneService) {}

  // Fonction pour intercepter une requête sortante
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const access_token = this.personneService.recupererAccessToken();
    if (access_token !== null) {
      let clone = this.ajouterEnTeteAuthorization(request, access_token);

      return next.handle(clone).pipe(
        catchError(error => {
          if (error.status === 403) {
            this.gestionErreur403(request, next);
          }
          return throwError({ message: 'Token expiré', error: error });
        }),
      );
    }
    return next.handle(request);
  }

  // Fonction pour ajouter des entêtes aux requêtes sortantes
  private ajouterEnTeteAuthorization(request: HttpRequest<unknown>, access_token: string): HttpRequest<unknown> {
    return request.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
      }),
    });
  }

  // Fonction pour gérer des erreurs 401
  private gestionErreur403(request: HttpRequest<unknown>, next: HttpHandler){
    return this.personneService.rafraichirToken().pipe(
      switchMap((response) => {
        this.personneService.enregistrerToken(response.access_token, response.refresh_token);
        let clone = this.ajouterEnTeteAuthorization(request, response.access_token);
        return next.handle(clone);
      }),
      catchError((refreshError) => {
        if (refreshError.status === 403) {
          this.personneService.deconnexion();
          return throwError({ message: 'Refresh token expiré', error: refreshError });
        }
        return throwError({ message: 'Erreur inattendue lors du rafraîchissement du token', error: refreshError });
      }),
    );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
