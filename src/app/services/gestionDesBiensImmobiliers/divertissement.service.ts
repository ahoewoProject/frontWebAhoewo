import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Divertissement } from 'src/app/models/gestionDesBiensImmobiliers/Divertissement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DivertissementService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Recherche d'une occurrence de divertissement par la clé primaire d'un bien immobilier ;
  // url: http://localhost:4040/api/divertissement/{id}
  getDivertissementByBienImmobilier(idBienImmobilier: number): Observable<Divertissement>{
    return this.httpClient.get<Divertissement>(this.url + 'divertissement/' + idBienImmobilier);
  }
}
