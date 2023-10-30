import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  public _service: Services = new Services();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de services;
  // url: http://localhost:4040/api/services/ajouter
  addServices(s: Services): Observable<Services>{
    return this.httpClient.post<Services>(this.url + 'services/ajouter', s);
  }

  // Modification d'une occurrence de services;
  // url: http://localhost:4040/api/services/modifier/{id}
  updateServices(id: number, s: Services): Observable<Services>{
    return this.httpClient.put<Services>(this.url + 'services/modifier/'+ id, s);
  }

  // Suppression d'une occurrence de role par la clé primaire ;
  // url: http://localhost:4040/api/services/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'services/supprimer/' + id);
  }

  // Affichage de toutes les occurrences de services pour une agence immobilière;
  // url: http://localhost:4040/api/services/agence-immobiliere
  getAllByAgenceImmobiliere(): Observable<Array<Services>>{
    return this.httpClient.get<Array<Services>>(this.url + 'services/agence-immobiliere');
  }

  // Recherche d'une occurrence de services par la clé primaire ;
  // url: http://localhost:4040/api/services/{id}
  findById(id: number): Observable<Services>{
    return this.httpClient.get<Services>(this.url + 'services/' + id);
  }

  // Affichage du nombre d'occurrences de services.
  // url: http://localhost:4040/api/count/services
  countServices(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/services');
  };
}
