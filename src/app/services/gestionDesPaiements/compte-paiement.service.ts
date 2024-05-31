import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { ComptePaiement } from 'src/app/models/gestionDesPaiements/ComptePaiement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComptePaiementService {

  public comptePaiement: ComptePaiement = new ComptePaiement();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des comptes paiements paginées;
  // url: http://localhost:4040/api/comptes-paiements
  getComptesPaiements(numeroDeLaPage: number, elementsParPage: number): Observable<Page<ComptePaiement>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ComptePaiement>>(this.url + 'comptes-paiements', {params: params});
  }

  // Recherche d'une occurrence d'un compte paiement par la clé primaire ;
  // url: http://localhost:4040/api/compte-paiement/{comptePaiementId}
  findById(comptePaiementId: number): Observable<ComptePaiement>{
    return this.httpClient.get<ComptePaiement>(this.url + 'compte-paiement/' + comptePaiementId);
  }

  // Ajouter un compte paiement;
  // url: http://localhost:4040/api/compte-paiement/ajouter
  ajouterComptePaiement(cp: ComptePaiement): Observable<ComptePaiement>{
    return this.httpClient.post<ComptePaiement>(this.url + 'compte-paiement/ajouter', cp);
  }

  // Modifier un compte paiement;
  // url: http://localhost:4040/api/compte-paiement/modifier/{id}
  modifierComptePaiement(id: number, cp: ComptePaiement): Observable<ComptePaiement>{
    return this.httpClient.put<ComptePaiement>(this.url + 'compte-paiement/modifier/' + id, cp);
  }

  // Activer un compte paiement utilisateur ;
  // url: http://localhost:4040/api/activer-user/compte-paiement/{comptePaiementId}
  activerComptePaiementByPersonne(comptePaiementId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer-user/compte-paiement/' + comptePaiementId);
  }

  // Activer un compte paiement utilisateur ;
  // url: http://localhost:4040/api/desactiver-user/compte-paiement/desactiver/{comptePaiementId}
  desactiverComptePaiementByPersonne(comptePaiementId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer-user/compte-paiement/' + comptePaiementId);
  }

  // Activer un compte paiement agence ;
  // url: http://localhost:4040/api/activer-agence/compte-paiement/{comptePaiementId}/{agenceId}
  activerComptePaiementByAgence(comptePaiementId: number, agenceId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer-agence/compte-paiement/' + comptePaiementId + '/' + agenceId);
  }

  // Activer un compte paiement agence ;
  // url: http://localhost:4040/api/desactiver-agence/compte-paiement/desactiver/{comptePaiementId}/{agenceId}
  desactiverComptePaiementByAgence(comptePaiementId: number, agenceId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver-agence/compte-paiement/' + comptePaiementId + '/' + agenceId);
  }
}
