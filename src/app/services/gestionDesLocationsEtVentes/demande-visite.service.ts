import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { DemandeVisite } from 'src/app/models/gestionDesLocationsEtVentes/DemandeVisite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeVisiteService {

  public demandeVisite: DemandeVisite = new DemandeVisite();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage - liste des demandes de visites;
  // url: http://localhost:4040/api/demandes-visites-list
  getDemandesVisitesList(): Observable<Array<DemandeVisite>>{
    return this.httpClient.get<Array<DemandeVisite>>(this.url + 'demandes-visites-list');
  }

  // Affichage des demandes de visites paginées;
  // url: http://localhost:4040/api/demandes-visites
  getDemandesVisites(numeroDeLaPage: number, elementsParPage: number): Observable<Page<DemandeVisite>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<DemandeVisite>>(this.url + 'demandes-visites', {params: params});
  }

  // Recherche d'une occurrence d'une demande de visite par la clé primaire ;
  // url: http://localhost:4040/api/demande-visite/{id}
  findById(id: number): Observable<DemandeVisite>{
    return this.httpClient.get<DemandeVisite>(this.url + 'demande-visite/' + id);
  }

  // Soumettre une demande de visite;
  // url: http://localhost:4040/api/demande-visite/soumettre
  addDemandeVisite(d: DemandeVisite): Observable<DemandeVisite>{
    return this.httpClient.post<DemandeVisite>(this.url + 'demande-visite/soumettre', d);
  }

  // Modifier une demande de visite ;
  // url: http://localhost:4040/api/demande-visite/modifier/{id}
  editDemandeVisite(id: number, d: DemandeVisite): Observable<DemandeVisite>{
    return this.httpClient.put<DemandeVisite>(this.url + 'demande-visite/modifier/' + id, d);
  }

  // Relancer une demande de visite ;
  // url: http://localhost:4040/api/demande-visite/relancer/{id}
  relancer(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'demande-visite/relancer/' + id);
  }

  // Valider une demande de visite ;
  // url: http://localhost:4040/api/demande-visite/valider/{id}
  valider(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'demande-visite/valider/' + id);
  }

  // Refuser une demande de visite ;
  // url: http://localhost:4040/api/demande-visite/refuser/{id}
  refuser(id: number, m: MotifForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-visite/refuser/' + id, m);
  }

  // Annuler une demande de visite ;
  // url: http://localhost:4040/api/demande-visite/annuler/{id}
  annuler(id: number, m: MotifForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-visite/annuler/' + id, m);
  }
}
