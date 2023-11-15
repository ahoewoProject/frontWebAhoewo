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

  // Affichage de toutes les occurrences de services par agent immobilier;
  // url: http://localhost:4040/api/services/agence/agent-immobilier
  getServicesAgenceAgentImmobilier(): Observable<Array<Services>>{
    return this.httpClient.get<Array<Services>>(this.url + 'services/agence/agent-immobilier');
  }

  // Recherche d'une occurrence de services par la clé primaire ;
  // url: http://localhost:4040/api/services/{id}
  findById(id: number): Observable<Services>{
    return this.httpClient.get<Services>(this.url + 'services/' + id);
  }

  // Activation d'un service;
  // url: http://localhost:4040/api/activer/service/{id}
  activerService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/service/' + id);
  }

  // Désactivation d'un service;
  // url: http://localhost:4040/api/desactiver/service/{id}
  desactiverService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/service/' + id);
  }

  // Affichage du nombre d'occurrences de services d'une agence immobilière.
  // url: http://localhost:4040/api/count/services
  countServices(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/services');
  };

  // Affichage du nombre d'occurrences de services d'une agence immobilière par agent immobilier.
  // url: http://localhost:4040/api/count/services/agent-immobilier
  countServicesAgentImmobilier(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/services/agent-immobilier');
  };
}
