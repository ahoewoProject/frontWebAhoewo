import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { SuiviEntretien } from 'src/app/models/gestionDesLocationsEtVentes/SuiviEntretien';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuiviEntretienService {

  public suiviEntretien: SuiviEntretien = new SuiviEntretien();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des suivis d'entretiens paginées;
  // url: http://localhost:4040/api/suivis-entretiens
  getSuiviEntretiens(numeroDeLaPage: number, elementsParPage: number): Observable<Page<SuiviEntretien>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<SuiviEntretien>>(this.url + 'suivis-entretiens', {params: params});
  }

  // Recherche d'une occurrence d'un suivi d'entretien par la clé primaire ;
  // url: http://localhost:4040/api/suivi-entretien/{id}
  findById(id: number): Observable<SuiviEntretien>{
    return this.httpClient.get<SuiviEntretien>(this.url + 'suivi-entretien/' + id);
  }

  // Soumettre un suivi d'entretien;
  // url: http://localhost:4040/api/suivi-entretien/ajouter
  ajouterSuiviEntretien(s: SuiviEntretien): Observable<SuiviEntretien>{
    return this.httpClient.post<SuiviEntretien>(this.url + 'suivi-entretien/ajouter', s);
  }

  // Modifier un suivi d'entretien ;
  // url: http://localhost:4040/api/suivi-entretien/modifier/{id}
  modifierSuiviEntretien(id: number, s: SuiviEntretien): Observable<SuiviEntretien>{
    return this.httpClient.put<SuiviEntretien>(this.url + 'suivi-entretien/modifier/' + id, s);
  }

  // Débuter un entretien ;
  // url: http://localhost:4040/api/suivi-entretien/debuter/{id}
  debuterEntretien(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'suivi-entretien/debuter/' + id);
  }

  // Terminer un entretien ;
  // url: http://localhost:4040/api/suivi-entretien/terminer/{id}
  terminerEntretien(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'suivi-entretien/terminer/' + id);
  }
}
