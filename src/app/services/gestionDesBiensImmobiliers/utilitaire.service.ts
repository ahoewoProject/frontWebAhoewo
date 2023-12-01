import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilitaire } from 'src/app/models/gestionDesBiensImmobiliers/Utilitaire';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilitaireService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Recherche d'une occurrence d'utilitaire par la clé primaire d'un bien immobilier ;
  // url: http://localhost:4040/api/utilitaire/{id}
  getUtilitaireByBienImmobilier(idBienImmobilier: number): Observable<Utilitaire>{
    return this.httpClient.get<Utilitaire>(this.url + 'utilitaire/' + idBienImmobilier);
  }
}
