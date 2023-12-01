import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Confort } from 'src/app/models/gestionDesBiensImmobiliers/Confort';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfortService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Recherche d'une occurrence de confort par la clé primaire d'un bien immobilier ;
  // url: http://localhost:4040/api/confort/{id}
  getConfortByBienImmobilier(idBienImmobilier: number): Observable<Confort>{
    return this.httpClient.get<Confort>(this.url + 'confort/' + idBienImmobilier);
  }
}
