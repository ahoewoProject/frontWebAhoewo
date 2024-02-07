import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaracteristiquesService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Recherche d'une occurrence de caractéristiques par la clé primaire d'un bien immobilier ;
  // url: http://localhost:4040/api/caracteristiques/bien-immobilier/{idBienImmobilier}
  getCaracteristiquesOfBienImmobilier(idBienImmobilier: number): Observable<Caracteristiques>{
    return this.httpClient.get<Caracteristiques>(this.url + 'caracteristiques/bien-immobilier/' + idBienImmobilier);
  }
}
