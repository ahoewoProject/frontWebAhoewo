import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
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

  // Affichage des paiements paginées;
  // url: http://localhost:4040/api/paiements
  getPaiements(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Paiement>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Paiement>>(this.url + 'paiements', {params: params});
  }

  // Recherche d'une occurrence d'un paiement par la clé primaire ;
  // url: http://localhost:4040/api/paiement/{id}
  findById(id: number): Observable<Paiement>{
    return this.httpClient.get<Paiement>(this.url + 'paiement/' + id);
  }

  // Ajout d'un paiement
  // url: http://localhost:4040/api/paiement/ajouter
  ajouterPaiement(p: Paiement): Observable<Paiement> {
    return this.httpClient.post<Paiement>(this.url + 'paiement/ajouter', p);
  }

  // Générer un pdf (reçu de paiement)
  // url: http://localhost:4040/api/paiement/generer-pdf/{id}
  genererPaiementPdf(id: number): Observable<Blob> {
    return this.httpClient.get<Blob>(this.url + 'paiement/generer-pdf/' + id)
  }
}
