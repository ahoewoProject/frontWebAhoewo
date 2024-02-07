import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AffectationAgentAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgence';
import { AffectationAgentAgenceRequest } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgenceRequest';
import { Page } from 'src/app/interfaces/Page';

@Injectable({
  providedIn: 'root'
})
export class AffectationAgentAgenceService {

  public affectationAgentAgenceRequest: AffectationAgentAgenceRequest = new AffectationAgentAgenceRequest();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage de toutes les occurrences des agents immobiliers;
  // url: http://localhost:4040/api/affectations-agents-agences
  getAll(): Observable<Array<AffectationAgentAgence>>{
    return this.httpClient.get<Array<AffectationAgentAgence>>(this.url + 'affectations-agents-agences');
  }

  //Affichage de toutes les occurrences des agents immobiliers par responsable d'agence immobilière;
  // url: http://localhost:4040/api/affectations-agents-agences/responsable
  getAgentsOfAgence(): Observable<Array<AffectationAgentAgence>>{
    return this.httpClient.get<Array<AffectationAgentAgence>>(this.url + 'affectations-agents-agences/responsable');
  }

  //Affichage de toutes les occurrences des agences immobilières par agent immobilier;
  // url: http://localhost:4040/api/affectations-agents-agences/agent
  getAgencesOfAgent(): Observable<Array<AffectationResponsableAgence>>{
    return this.httpClient.get<Array<AffectationResponsableAgence>>(this.url + 'affectations-agents-agences/agent');
  }

  //Affichage de toutes les occurrences des agences immobilières paginées par agent immobilier;
  // url: http://localhost:4040/api/affectations-agents-agences/agent/paginees
  getAgencesOfAgentPaginees(numeroDeLaPage: number, elementsParPage: number): Observable<Page<AffectationResponsableAgence>>{
    let params = new HttpParams()
    .set('numeroDeLaPage', numeroDeLaPage.toString())
    .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AffectationResponsableAgence>>(this.url + 'affectations-agents-agences/agent/paginees', {params: params});
  }

  // url: http://localhost:4040/api/affectation-agent-agence/{id}
  findById(id: number): Observable<AffectationAgentAgence>{
    return this.httpClient.get<AffectationAgentAgence>(this.url + 'affectation-agent-agence/' + id);
  }

  // url: http://localhost:4040/api/affectation-agent-agence/ajouter
  ajouterAgentAgence(a: AffectationAgentAgenceRequest): Observable<AffectationAgentAgence>{
    return this.httpClient.post<AffectationAgentAgence>(this.url + 'affectation-agent-agence/ajouter', a);
  }

  // url: http://localhost:4040/api/affectation-matricule-agent-agence/ajouter
  ajoutParMatriculeAgent(a: AffectationAgentAgenceRequest): Observable<AffectationAgentAgence>{
    return this.httpClient.post<AffectationAgentAgence>(this.url + 'affectation-matricule-agent-agence/ajouter', a);
  }

  // url: http://localhost:4040/api/activer/agent-agence/{id}
  activerCompteAgentAgence(id: number) {
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'activer/agent-agence/' + id);
  }

  // url: http://localhost:4040/api/desactiver/agent-agence/{id}
  desactiverCompteAgentAgence(id: number) {
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'desactiver/agent-agence/' + id);
  }
}
