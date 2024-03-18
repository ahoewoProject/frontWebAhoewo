import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { MotifRejetForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetForm';
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

  // Affichage de toutes les occurrences de services avec pagination;
  getServicesPagines(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Services>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Services>>(this.url + 'services/pagines', {params: params});
  }

  // Affichage de toutes les occurrences de services (inexistants) avec pagination;
  getAutresServicesPagines(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Services>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Services>>(this.url + 'autres-services/pagines', {params: params});
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
  // url: http://localhost:4040/api/activer/services/{id}
  activerService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/services/' + id);
  }

  // Désactivation d'un service;
  // url: http://localhost:4040/api/desactiver/services/{id}
  desactiverService(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/services/' + id);
  }

  // Valider d'un service;
  // url: http://localhost:4040/api/valider/services/{id}
  validerServices(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'valider/services/' + id);
  }

  // Rejet d'un service;
  // url: http://localhost:4040/api/rejeter/services
  rejeterServices(m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'rejeter/services', m);
  }
}
