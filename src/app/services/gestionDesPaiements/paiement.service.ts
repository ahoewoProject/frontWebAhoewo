import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  public paiement: Paiement = new Paiement();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage - liste des paiements;
  // url: http://localhost:4040/api/paiements-list
  getPaiementsList(): Observable<Array<Paiement>>{
    return this.httpClient.get<Array<Paiement>>(this.url + 'paiements-list');
  }

  // Affichage des paiements paginées;
  // url: http://localhost:4040/api/paiements
  getPaiements(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Paiement>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Paiement>>(this.url + 'paiements', {params: params});
  }

  // Affichage des paiements paginées (par code contrat);
  // url: http://localhost:4040/api/paiements
  getPaiementsByCodeContrat(codeContrat: string, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Paiement>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Paiement>>(this.url + 'paiements/par-code-contrat/' + codeContrat, {params: params});
  }

  // Recherche d'une occurrence d'un paiement par la clé primaire ;
  // url: http://localhost:4040/api/paiement/{id}
  findById(id: number): Observable<Paiement>{
    return this.httpClient.get<Paiement>(this.url + 'paiement/' + id);
  }

  // Recherche d'une occurence de paiement par code de planification;
  // url: http://localhost:4040/api/paiement/code-planification/{codePlanification}
  findByCodePlanification(codePlanification: string): Observable<Paiement> {
    return this.httpClient.get<Paiement>(this.url + 'paiement/code-planification/' + codePlanification);
  }

  // Ajout d'un paiement
  // url: http://localhost:4040/api/paiement/ajouter
  ajouterPaiement(p: FormData): Observable<Paiement> {
    return this.httpClient.post<Paiement>(this.url + 'paiement/ajouter', p);
  }

  effectuerPaiement(p: PlanificationPaiement): Observable<any> {
    return this.httpClient.post<any>(this.url + 'effectuer-paiement', p);
  }

  // Télécharger fiche paiement (reçu de paiement);
  // url: http://localhost:4040/api/paiement/generer-pdf/{id}
  telechargerFichePaiement(id: number): Observable<any> {
    return this.httpClient.get(this.url + 'paiement/generer-pdf/' + id, { responseType: 'blob' });
  }

  // Télécharger preuve paiement;
  // url: http://localhost:4040/api/paiement/preuve/{id}
  telechargerPreuvePaiement(id: number): Observable<any> {
    return this.httpClient.get(this.url + 'paiement/preuve/' + id, { responseType: 'blob' });
  }

  // Valider un paiement ;
  // url: http://localhost:4040/api/paiement/valider/{id}
  validerPaiement(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'paiement/valider/' + id);
  }

  // initializePaymentByPaydunya(libelle: string, montantPaye: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('libelle', libelle)
  //     .set('montantPaye', montantPaye.toString());

  //   return this.httpClient.get(this.url + 'paydunya-initialize', {params: params, responseType: 'text'});
  // }

  initializePaymentByPaydunya(p: FormData): Observable<any> {
    return this.httpClient.post(this.url + 'paydunya-initialize', p, { responseType: 'text' });
  }

  initializePaymentByPayPal(p: Paiement): Observable<any> {
    return this.httpClient.post(this.url + 'paypal-initialize', p, { responseType: 'text' });
  }
}
