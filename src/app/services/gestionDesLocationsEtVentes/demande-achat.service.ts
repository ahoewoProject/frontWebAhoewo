import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { MotifRejetForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetForm';
import { DemandeAchat } from 'src/app/models/gestionDesLocationsEtVentes/DemandeAchat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeAchatService {

  public demandeAchat: DemandeAchat = new DemandeAchat();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des demandes d'achats paginées;
  // url: http://localhost:4040/api/demandes-achats
  getDemandesAchats(numeroDeLaPage: number, elementsParPage: number): Observable<Page<DemandeAchat>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<DemandeAchat>>(this.url + 'demandes-achats', {params: params});
  }

  // Recherche d'une occurrence d'une demande d'achat par la clé primaire ;
  // url: http://localhost:4040/api/demande-achat/{id}
  findById(id: number): Observable<DemandeAchat>{
    return this.httpClient.get<DemandeAchat>(this.url + 'demande-achat/' + id);
  }

  // Soumettre une demande d'achat;
  // url: http://localhost:4040/api/demande-achat/soumettre
  addDemandeAchat(d: DemandeAchat): Observable<DemandeAchat>{
    return this.httpClient.post<DemandeAchat>(this.url + 'demande-achat/soumettre', d);
  }

  // Valider une demande d'achat ;
  // url: http://localhost:4040/api/demande-achat/valider/{id}
  valider(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'demande-achat/valider/' + id);
  }

  // Refuser une demande d'achat ;
  // url: http://localhost:4040/api/demande-achat/refuser/{id}
  refuser(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-achat/refuser' + id, m);
  }

  // Annuler une demande d'achat ;
  // url: http://localhost:4040/api/demande-achat/annuler/{id}
  annuler(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-achat/annuler' + id, m);
  }
}
