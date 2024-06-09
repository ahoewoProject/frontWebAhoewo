import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AffectationResponsableAgenceRequest } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgenceRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffectationResponsableAgenceService {

  public affectationResponsableAgenceRequest: AffectationResponsableAgenceRequest = new AffectationResponsableAgenceRequest();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  //Affichage List Affectation Responsable Agence;
  // url: http://localhost:4040/api/affectations-responsable-agence/list
  getAffectationsResponsableAgenceList(): Observable<Array<AffectationResponsableAgence>>{
    return this.httpClient.get<Array<AffectationResponsableAgence>>(this.url + 'affectations-responsable-agence/list');
  }

  //Affichage Affectation Responsable Agence Page;
  // url: http://localhost:4040/api/affectations-responsable-agence/page
  getAffectationsReponsableAgencePage(numeroDeLaPage: number, elementsParPage: number): Observable<Page<AffectationResponsableAgence>>{
    let params = new HttpParams()
    .set('numeroDeLaPage', numeroDeLaPage.toString())
    .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AffectationResponsableAgence>>(this.url + 'affectations-responsables-agences/responsable/pagines', {params: params});
  }

  // Recherche d'une occurrence d'affectation responsable agence par la clé primaire ;
  // url: http://localhost:4040/api/affectation-responsable-agence/{id}
  detailAffectation(id: number): Observable<AffectationResponsableAgence>{
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'affectation-responsable-agence/' + id);
  }

  // url: http://localhost:4040/api/affectation-responsable-agence/ajouter
  ajouterResponsableAgence(a: AffectationResponsableAgenceRequest): Observable<AffectationResponsableAgenceRequest>{
    return this.httpClient.post<AffectationResponsableAgenceRequest>(this.url + 'affectation-responsable-agence/ajouter', a);
  }

  // url: http://localhost:4040/api/affectation-matricule-responsable-agence/ajouter
  ajoutParMatriculeResponsable(a: AffectationResponsableAgenceRequest): Observable<AffectationResponsableAgenceRequest>{
    return this.httpClient.post<AffectationResponsableAgenceRequest>(this.url + 'affectation-matricule-responsable-agence/ajouter', a);
  }

  // url: http://localhost:4040/api/desactiver/responsable-agence/{id}
  activerCompteResponsableAgence(id: number) {
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'desactiver/responsable-agence/' + id);
  }

  // url: http://localhost:4040/api/desactiver/responsable-agence/{id}
  desactiverCompteResponsableAgence(id: number) {
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'desactiver/responsable-agence/' + id);
  }
}
