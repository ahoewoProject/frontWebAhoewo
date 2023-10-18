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
          console.log(error);
          if (error.status === 401) {
            this.gestionErreur401(request, next);
          }
          return throwError('Token expiré');
        })
      );
    }
    return next.handle(request);
  }

  // Fonction pour ajouter des entêtes aux requêtes sortantes
  private ajouterEnTeteAuthorization(request: HttpRequest<unknown>, access_token: string): HttpRequest<unknown> {
    return request.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
      })
    });
  }

  // Fonction pour gérer des erreurs 401
  private gestionErreur401(request: HttpRequest<unknown>, next: HttpHandler){
    return this.personneService.rafraichirToken().pipe(
      switchMap((response) => {
        this.personneService.enregistrerToken(response.access_token, response.refresh_token);
        let clone = this.ajouterEnTeteAuthorization(request, response.access_token);
        return next.handle(clone);
      }),
      catchError((refreshError) => {
        console.log('Erreur lors du rafraîchissement du token:', refreshError);
        return throwError('Impossible de rafraîchir le token');
      })
    );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
