import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BienImmobilierService {

  public bienImmobilier: BienImmobilier = new BienImmobilier();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage de toutes les occurrences des biens immobiliers;
  // url: http://localhost:4040/api/biens-immobiliers
  getBiensImmobiliers(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers');
  }

  // Affichage de toutes les occurrences des biens supports;
  // url: http://localhost:4040/api/biens-supports
  getBiensSupports(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-supports');
  }

  // Affichage de toutes les occurrences de biens immobiliers paginés;
  // url: http://localhost:4040/api/biens-supports-pagines
  getBiensSupportsPagines(numeroDeLaPage: number, elementsParPage: number): Observable<Page<BienImmobilier>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<BienImmobilier>>(this.url + 'biens-supports-pagines', {params: params});
  }

  // Ajout d'une occurrence d'un bien immobilier;
  // url: http://localhost:4040/api/bien-immobilier/ajouter
  addBienImmobilier(b: FormData): Observable<BienImmobilier>{
    return this.httpClient.post<BienImmobilier>(this.url + 'bien-immobilier/ajouter', b);
  }

  // Modification d'une occurrence d'un bien immobilier;
  // url: http://localhost:4040/api/bien-immobilier/modifier/{id}
  updateBienImmobilier(id: number, b: FormData): Observable<BienImmobilier>{
    return this.httpClient.put<BienImmobilier>(this.url + 'bien-immobilier/modifier/'+ id, b);
  }

  // Recherche d'une occurrence d'un bien immobilier par la clé primaire ;
  // url: http://localhost:4040/api/bien-immobilier/{id}
  findById(id: number): Observable<BienImmobilier>{
    return this.httpClient.get<BienImmobilier>(this.url + 'bien-immobilier/' + id);
  }

  // url: http://localhost:4040/api/bien-immobilier/code-bien/{codeBien}
  findByCodeBien(codeBien: string): Observable<BienImmobilier>{
    return this.httpClient.get<BienImmobilier>(this.url + 'bien-immobilier/code-bien/' + codeBien);
  }

  // Affichage de toutes les occurrences de biens immobiliers par propriétaire;
  // url: http://localhost:4040/api/biens-immobiliers/proprietaire
  getBiensByProprietaire(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/proprietaire');
  }

  // Affichage des occurences des biens propres et délégués;
  // url: http://localhost:4040/api/biens-immobiliers/propres-delegues
  getBiensPropresDelegues(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/propres-delegues');
  }

  // url: http://localhost:4040/api/activer/bien-immobilier/{id}
  activerBienImmobilier(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer/bien-immobilier/' + id);
  }

  // url: http://localhost:4040/api/desactiver/bien-immobilier/{id}
  desactiverBienImmobilier(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver/bien-immobilier/' + id);
  }

  // Fonction pour afficher la premiere image d'un bien immobilier
  getPremiereImage(id: number): Observable<HttpResponse<Blob>> {
    const endpoint = this.url + 'premiere-image/bien-immobilier/' + id;

    return this.httpClient.get(endpoint, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
