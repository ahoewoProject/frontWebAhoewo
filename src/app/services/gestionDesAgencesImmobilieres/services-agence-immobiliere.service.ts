import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { ServiceNonTrouveForm } from 'src/app/models/gestionDesAgencesImmobilieres/ServiceNonTrouveForm';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesAgenceImmobiliereService {

  public serviceAgenceImmobiliere: ServicesAgenceImmobiliere = new ServicesAgenceImmobiliere();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage de toutes les occurrences des services de chaque agence immobilieres;
  // url: http://localhost:4040/api/services/agences-immobilieres
  getServicesOfAgences(): Observable<Array<ServicesAgenceImmobiliere>>{
    return this.httpClient.get<Array<ServicesAgenceImmobiliere>>(this.url + 'services');
  }

  //Affichage des services à partir du nom d'une agence
  // url: http://localhost:4040/api/services/agence/{nomAgence}
  getServicesByNomAgence(nomAgence: String, numeroDeLaPage: number, elementsParPage: number): Observable<Page<ServicesAgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ServicesAgenceImmobiliere>>(this.url + 'services/agence/' + nomAgence, {params: params});
  }

  // Affichage de toutes les occurrences de services d'agence immobilière;
  // url: http://localhost:4040/api/services/agence-immobiliere/pagines
  getServicesOfAgencePagines(numeroDeLaPage: number, elementsParPage: number): Observable<Page<ServicesAgenceImmobiliere>>{
    let params = new HttpParams()
    .set('numeroDeLaPage', numeroDeLaPage.toString())
    .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ServicesAgenceImmobiliere>>(this.url + 'services/agence-immobiliere/pagines', {params: params});
  }

  // url: http://localhost:4040/api/services/agence-immobiliere/pagines/{id}
  findServicesOfAgencePagines(id: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<ServicesAgenceImmobiliere>>{
    let params = new HttpParams()
    .set('numeroDeLaPage', numeroDeLaPage.toString())
    .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ServicesAgenceImmobiliere>>(this.url + 'services/agence-immobiliere/pagines/' + id, {params: params});
  }

  // url: http://localhost:4040/api/service/agence-immobiliere/{id}
  findById(id: number): Observable<ServicesAgenceImmobiliere>{
    return this.httpClient.get<ServicesAgenceImmobiliere>(this.url + 'service/agence-immobiliere/' + id);
  }

  // Ajout d'une occurrence de services d'agence immobilière;
  // url: http://localhost:4040/api/service/agence-immobiliere/ajouter
  addServicesAgence(s: ServicesAgenceImmobiliere): Observable<ServicesAgenceImmobiliere>{
    return this.httpClient.post<ServicesAgenceImmobiliere>(this.url + 'service/agence-immobiliere/ajouter', s);
  }

  // Demande d'ajout d'un nouveau service;
  // url: http://localhost:4040/api/demande/ajout-nouveau-service
  demandeAjoutNouveauService(s: ServiceNonTrouveForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande/ajout-nouveau-service', s);
  }

  // Modification d'une occurrence de services d'agence immobilière;
  // url: http://localhost:4040/api/service/agence-immobiliere/modifier/{id}
  updateServicesAgence(id: number, s: ServicesAgenceImmobiliere): Observable<ServicesAgenceImmobiliere>{
    return this.httpClient.put<ServicesAgenceImmobiliere>(this.url + 'service/agence-immobiliere/modifier/'+ id, s);
  }

  // Activation d'un service d'une agence immobilière;
  // url: http://localhost:4040/api/activer/service/agence-immobiliere/{id}
  activerServiceAgence(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/service/agence-immobiliere/' + id);
  }

  // Désactivation d'un service d'une agence immobilière;
  // url: http://localhost:4040/api/desactiver/service/agence-immobiliere/{id}
  desactiverServiceAgence(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/service/agence-immobiliere/' + id);
  }
}
