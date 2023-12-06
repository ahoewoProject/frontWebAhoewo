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

  // Affichage de toutes les occurrences des services;
  // url: http://localhost:4040/api/services
  getAll(): Observable<Array<Services>>{
    return this.httpClient.get<Array<Services>>(this.url + 'services');
  }

  // Affichage de toutes les occurrences des services;
  // url: http://localhost:4040/api/types-de-bien
  getServicesActifs(): Observable<Array<Services>>{
    return this.httpClient.get<Array<Services>>(this.url + 'services/actifs');
  }

  // Recherche d'une occurrence de services par la clé primaire ;
  // url: http://localhost:4040/api/services/{id}
  findById(id: number): Observable<Services>{
    return this.httpClient.get<Services>(this.url + 'services/' + id);
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

  // Activation d'un service;
  // url: http://localhost:4040/api/activer/service/{id}
  activerService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/services/' + id);
  }

  // Désactivation d'un service;
  // url: http://localhost:4040/api/desactiver/service/{id}
  desactiverService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/services/' + id);
  }
}