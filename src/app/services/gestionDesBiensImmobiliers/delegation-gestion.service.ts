import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
import { DelegationGestionRequest } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DelegationGestionService {

  public delegationGestion: DelegationGestion = new DelegationGestion();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Liste des delegations de gestion par proprietaire
  // url: http://localhost:4040/api/delegations-gestions/proprietaire
  getAllByProprietaire(): Observable<DelegationGestion[]> {
    return this.httpClient.get<DelegationGestion[]>(this.url + 'delegations-gestions/proprietaire');
  }

  // Liste des delegations de gestion par gestionnaire
  // url: http://localhost:4040/api/delegations-gestions/gestionnaire
  getAllByGestionnaire(): Observable<DelegationGestion[]> {
    return this.httpClient.get<DelegationGestion[]>(this.url + 'delegations-gestions/gestionnaire');
  }

  // Liste des delegations de gestion des agences par responsable
  // url: http://localhost:4040/api/delegations-gestions/agences/responsable
  getDelegationsGestionsOfAgencesByResponsable(): Observable<DelegationGestion[]> {
    return this.httpClient.get<DelegationGestion[]>(this.url + 'delegations-gestions/agences/responsable');
  }

  // Liste des delegations de gestion des agences par agent immobiliers
  // url: http://localhost:4040/api/delegations-gestions/agences/agent
  getDelegationsGestionsOfAgencesByAgent(): Observable<DelegationGestion[]> {
    return this.httpClient.get<DelegationGestion[]>(this.url + 'delegations-gestions/agences/agent');
  }

  // Affichage des détails d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/{id}
  findById(id: number): Observable<DelegationGestion> {
    return this.httpClient.get<DelegationGestion>(this.url + 'delegation-gestion/' + id);
  }

  // Ajout d'une delegation de gestion par matricule
  // url: http://localhost:4040/api/delegation-gestion/ajouter/matricule
  addDelegationGestionMatricule(d: DelegationGestionRequest): Observable<DelegationGestion> {
    return this.httpClient.post<DelegationGestion>(this.url + 'delegation-gestion/ajouter/matricule', d);
  }

  // Ajout d'une delegation de gestion par code agence
  // url: http://localhost:4040/api/delegation-gestion/ajouter/code-agence
  addDelegationGestionCodeAgence(d: DelegationGestionRequest): Observable<DelegationGestion> {
    return this.httpClient.post<DelegationGestion>(this.url + 'delegation-gestion/ajouter/code-agence', d);
  }

  // Acceptation d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/accepter/delegation-gestion/{id}
  accepterDelegationGestion(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'accepter/delegation-gestion/' + id);
  }

  // Refus d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/refuser/delegation-gestion/{id}
  refuserDelegationGestion(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'refuser/delegation-gestion/' + id);
  }

  // Suppression d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/supprimer/{id}
  deleteById(id: number) {
    return this.httpClient.delete<DelegationGestion>(this.url + 'delegation-gestion/supprimer/' + id);
  }
}
