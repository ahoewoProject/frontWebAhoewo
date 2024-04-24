import { Page } from 'src/app/interfaces/Page';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContratVente } from 'src/app/models/gestionDesLocationsEtVentes/ContratVente';
import { environment } from 'src/environments/environment';
import { MotifRejetForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetForm';

@Injectable({
  providedIn: 'root'
})
export class ContratVenteService {

  public contratVente: ContratVente = new ContratVente();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des contrats de ventes;
  // url: http://localhost:4040/api/contrats/ventes
  listContratsVentes(): Observable<Array<ContratVente>> {
    return this.httpClient.get<Array<ContratVente>>(this.url + 'contrats/ventes');
  }

  // Affichage des contrats de ventes paginées;
  // url: http://localhost:4040/api/contrats-ventes
  getContratsVentes(numeroDeLaPage: number, elementsParPage: number): Observable<Page<ContratVente>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ContratVente>>(this.url + 'contrats-ventes', {params: params});
  }

  // Recherche d'une occurrence d'un contrat de vente par la clé primaire ;
  // url: http://localhost:4040/api/contrat-vente/{id}
  findById(id: number): Observable<ContratVente>{
    return this.httpClient.get<ContratVente>(this.url + 'contrat-vente/' + id);
  }

  // Ajouter un contrat de vente ;
  // url: http://localhost:4040/api/contrat-vente/ajouter
  ajouterContratVente(c: ContratVente): Observable<ContratVente>{
    return this.httpClient.post<ContratVente>(this.url + 'contrat-vente/ajouter', c);
  }

  // Modifier un contrat de vente ;
  // url: http://localhost:4040/api/contrat-vente/modifier/{id}
  modifierContratVente(id: number, c: ContratVente): Observable<ContratVente>{
    return this.httpClient.put<ContratVente>(this.url + 'contrat-vente/modifier/' + id, c);
  }

  // Valider un contrat de vente ;
  // url: http://localhost:4040/api/contrat-vente/valider
  validerContratVente(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'contrat-vente/valider/' + id);
  }

  // Demande de modification d'un contrat de vente ;
  // url: http://localhost:4040/api/contrat-vente/demande-modification/{id}
  demandeModificationContratVente(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'contrat-vente/demande-modification/' + id, m);
  }

  // Refuser un contrat de vente ;
  // url: http://localhost:4040/api/contrat-vente/refuser/{id}
  refuserContratVente(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'contrat-vente/refuser/' + id, m);
  }
}
