import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
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

  // Affichage des détails d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/{id}
  findById(id: number): Observable<DelegationGestion> {
    return this.httpClient.get<DelegationGestion>(this.url + 'delegation-gestion/' + id);
  }

  // Ajout d'une delegation de gestion
  // url: http://localhost:4040/api/delegation-gestion/ajouter
  addDelegationGestion(d: DelegationGestion): Observable<DelegationGestion> {
    return this.httpClient.post<DelegationGestion>(this.url + 'delegation-gestion/ajouter', d);
  }

  // Acceptation d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/accepter/delegation-gestion/{id}
  accepterDelegationGestion(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'accepter/delegation-gestion/' + id);
  }

  // Suppression d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/supprimer/{id}
  deleteById(id: number) {
    return this.httpClient.delete<DelegationGestion>(this.url + 'delegation-gestion/supprimer/' + id);
  }

  // Affichage du nombre d'occurrences de delegation de gestion par proprietaire.
  // url: http://localhost:4040/api/count/delegations-gestions/proprietaire
  countDelegationGestionProprietaire(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/delegations-gestions/proprietaire');
  };

  // Affichage du nombre d'occurrences de delegation de gestion par gestionnaire.
  // url: http://localhost:4040/api/count/delegations-gestions/gestionnaire
  countDelegationGestionGestionnaire(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/delegations-gestions/gestionnaire');
  };
}
