import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
import { DelegationGestionForm1 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm1';
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

  // Liste des delegations de gestion
  // url: http://localhost:4040/api/delegations-gestions-list
  getDelegationsGestionsList(): Observable<DelegationGestion[]> {
    return this.httpClient.get<DelegationGestion[]>(this.url + 'delegations-gestions-list');
  }

  // Liste des delegations de gestion paginées
  // url: http://localhost:4040/api/delegations-gestions-paginees
  getDelegationsGestionsPaginees(numeroDeLaPage: number, elementsParPage: number): Observable<Page<DelegationGestion>> {
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<DelegationGestion>>(this.url + 'delegations-gestions-paginees', {params: params});
  }

  // Affichage des détails d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/{id}
  findById(id: number): Observable<DelegationGestion> {
    return this.httpClient.get<DelegationGestion>(this.url + 'delegation-gestion/' + id);
  }

  // url: http://localhost:4040/api/delegation-gestion/bien-immobilier/{idBienImmobilier}
  findByBienImmobilier(idBienImmobilier: number): Observable<DelegationGestion> {
    return this.httpClient.get<DelegationGestion>(this.url + 'delegation-gestion/bien-immobilier/' + idBienImmobilier);
  }

  // Ajout d'une delegation de gestion par matricule
  // url: http://localhost:4040/api/delegation-gestion/ajouter/matricule
  addDelegationGestionMatricule(d: DelegationGestionForm1): Observable<DelegationGestion> {
    return this.httpClient.post<DelegationGestion>(this.url + 'delegation-gestion/ajouter/matricule', d);
  }

  // Ajout d'une delegation de gestion par code agence
  // url: http://localhost:4040/api/delegation-gestion/ajouter/code-agence
  addDelegationGestionCodeAgence(d: DelegationGestionForm1): Observable<DelegationGestion> {
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

  // Activation d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/activer/{id}
  activerDelegationGestion(id: number) {
    return this.httpClient.delete<DelegationGestion>(this.url + 'delegation-gestion/activer/' + id);
  }

  // Desactivation d'une delegation de gestion par sa clé primaire
  // url: http://localhost:4040/api/delegation-gestion/desactiver/{id}
  desactiverDelegationGestion(id: number) {
    return this.httpClient.delete<DelegationGestion>(this.url + 'delegation-gestion/desactiver/' + id);
  }

  // Fonction pour enregistrer une delegation de gestion - Responsable, Agent immobilier, Demarcheur
  // url: http://localhost:4040/api/delegation-gestion/ajouter
  enregistrerDelegationGestion(d: FormData): Observable<DelegationGestion> {
    return this.httpClient.post<DelegationGestion>(this.url + 'delegation-gestion/ajouter', d);
  }
}
