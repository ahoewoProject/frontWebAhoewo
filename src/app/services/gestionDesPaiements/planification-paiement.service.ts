import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanificationPaiementService {

  public planificationPaiement: PlanificationPaiement = new PlanificationPaiement();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des planifications de paiements paginées;
  // url: http://localhost:4040/api/planifications-paiements
  getPlanificationsPaiements(numeroDeLaPage: number, elementsParPage: number): Observable<Page<PlanificationPaiement>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<PlanificationPaiement>>(this.url + 'planifications-paiements', {params: params});
  }

  // Recherche d'une occurrence d'une planification de paiements par la clé primaire ;
  // url: http://localhost:4040/api/planification-paiement/{id}
  findById(id: number): Observable<PlanificationPaiement>{
    return this.httpClient.get<PlanificationPaiement>(this.url + 'planification-paiement/' + id);
  }

  // Recherche de la dernière planification de paiement par code contrat;
  // url: http://localhost:4040/api/last-planification-paiement/{codeContrat}
  lastPlanificationPaiement(codeContrat: string): Observable<PlanificationPaiement>{
    return this.httpClient.get<PlanificationPaiement>(this.url + 'last-planification-paiement/' + codeContrat);
  }

  // Ajout d'une planification de paiement - location
  // url: http://localhost:4040/api/planification-paiement/location/ajouter
  ajouterPlanificationPaiementLocation(p: PlanificationPaiement): Observable<PlanificationPaiement> {
    return this.httpClient.post<PlanificationPaiement>(this.url + 'planification-paiement/location/ajouter', p);
  }

  // Ajout d'une planification de paiement - achat
  // url: http://localhost:4040/api/planification-paiement/achat/ajouter
  ajouterPlanificationPaiementAchat(p: PlanificationPaiement) {
    return this.httpClient.post<PlanificationPaiement>(this.url + 'planification-paiement/achat/ajouter', p);
  }
}
