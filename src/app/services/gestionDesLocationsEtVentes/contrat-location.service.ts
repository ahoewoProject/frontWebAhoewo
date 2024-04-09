import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { MotifRejetForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetForm';
import { Contrat } from 'src/app/models/gestionDesLocationsEtVentes/Contrat';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratLocationService {

  public contratLocation: ContratLocation = new ContratLocation();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des contrats de locations;
  // url: http://localhost:4040/api/contrats/locations
  listContratsLocations(): Observable<Array<ContratLocation>> {
    return this.httpClient.get<Array<ContratLocation>>(this.url + 'contrats/locations');
  }

  // Affichage des contrats de locations paginées;
  // url: http://localhost:4040/api/contrats-locations
  getContratsLocations(numeroDeLaPage: number, elementsParPage: number): Observable<Page<ContratLocation>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<ContratLocation>>(this.url + 'contrats-locations', {params: params});
  }

  // Recherche d'une occurrence d'un contrat de location par la clé primaire ;
  // url: http://localhost:4040/api/contrat-location/{id}
  findById(id: number): Observable<ContratLocation>{
    return this.httpClient.get<ContratLocation>(this.url + 'contrat-location/' + id);
  }

  // Ajouter un contrat de location ;
  // url: http://localhost:4040/api/contrat-location/ajouter
  ajouterContratLocation(c: ContratLocation): Observable<ContratLocation>{
    return this.httpClient.post<ContratLocation>(this.url + 'contrat-location/ajouter', c);
  }

  // Modifier un contrat de location ;
  // url: http://localhost:4040/api/contrat-location/modifier/{id}
  modifierContratLocation(id: number, c: ContratLocation): Observable<ContratLocation>{
    return this.httpClient.put<ContratLocation>(this.url + 'contrat-location/modifier/' + id, c);
  }

  // Valider un contrat de location ;
  // url: http://localhost:4040/api/contrat-location/valider/{id}
  validerContratLocation(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'contrat-location/valider/' + id);
  }

  // Demande de modification d'un contrat de location ;
  // url: http://localhost:4040/api/contrat-location/demande-modification/{id}
  demandeModificationContratLocation(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'contrat-location/demande-modification/' + id, m);
  }

  // Refuser un contrat de location ;
  // url: http://localhost:4040/api/contrat-location/refuser/{id}
  refuserContratLocation(id: number, m: MotifRejetForm): Observable<any>{
    return this.httpClient.post<any>(this.url + 'contrat-location/refuser/' + id, m);
  }

  // Mettre fin à un contrat ;
  // url: http://localhost:4040/api/contrat-location/mettre-fin/{id}
  mettreFin(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'contrat-location/mettre-fin/' + id);
  }
}
