import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  // Affichage de toutes les occurrences des services d'agence immobilière;
  // url: http://localhost:4040/api/services/agence-immobiliere
  getServicesOfAgence(): Observable<Array<ServicesAgenceImmobiliere>>{
    return this.httpClient.get<Array<ServicesAgenceImmobiliere>>(this.url + 'services/agence-immobiliere');
  }

  // url: http://localhost:4040/api/services/agence-immobiliere/{id}
  findServicesOfAgence(id: number): Observable<Array<ServicesAgenceImmobiliere>>{
    return this.httpClient.get<Array<ServicesAgenceImmobiliere>>(this.url + 'services/agence-immobiliere/' + id);
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
