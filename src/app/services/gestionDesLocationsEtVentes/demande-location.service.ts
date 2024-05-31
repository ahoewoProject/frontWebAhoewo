import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { DemandeLocation } from 'src/app/models/gestionDesLocationsEtVentes/DemandeLocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeLocationService {

  public demandeLocation: DemandeLocation = new DemandeLocation();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage - liste des demandes de locations;
  // url: http://localhost:4040/api/demandes-locations-list
  getDemandesLocationsList(): Observable<Array<DemandeLocation>>{
    return this.httpClient.get<Array<DemandeLocation>>(this.url + 'demandes-locations-list');
  }

  // Affichage des demandes de locations paginées;
  // url: http://localhost:4040/api/demandes-locations
  getDemandesLocations(numeroDeLaPage: number, elementsParPage: number): Observable<Page<DemandeLocation>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<DemandeLocation>>(this.url + 'demandes-locations', {params: params});
  }

  // Recherche d'une occurrence d'une demande d'achat par la clé primaire ;
  // url: http://localhost:4040/api/demande-location/{id}
  findById(id: number): Observable<DemandeLocation>{
    return this.httpClient.get<DemandeLocation>(this.url + 'demande-location/' + id);
  }

  // Soumettre une demande de location;
  // url: http://localhost:4040/api/demande-location/soumettre
  addDemandeLocation(d: DemandeLocation): Observable<DemandeLocation>{
    return this.httpClient.post<DemandeLocation>(this.url + 'demande-location/soumettre', d);
  }

  // Modifier une demande de location ;
  // url: http://localhost:4040/api/demande-location/modifier/{id}
  editDemandeLocation(id: number, d: DemandeLocation): Observable<DemandeLocation>{
    return this.httpClient.put<DemandeLocation>(this.url + 'demande-location/modifier/' + id, d);
  }

  // Relancer une demande de location ;
  // url: http://localhost:4040/api/demande-location/relancer/{id}
  relancer(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'demande-location/relancer/' + id);
  }

  // Valider une demande de location ;
  // url: http://localhost:4040/api/demande-location/valider/{id}
  valider(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'demande-location/valider/' + id);
  }

  // Refuser une demande de location ;
  // url: http://localhost:4040/api/demande-location/refuser/{id}
  refuser(id: number, m: MotifForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-location/refuser/' + id, m);
  }

  // Annuler une demande de location ;
  // url: http://localhost:4040/api/demande-location/annuler/{id}
  annuler(id: number, m: MotifForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'demande-location/annuler/' + id, m);
  }
}
