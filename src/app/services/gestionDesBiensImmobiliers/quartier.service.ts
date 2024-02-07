import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuartierService {

  public quartier: Quartier = new Quartier();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de quartier;
  // url: http://localhost:4040/api/quartier/ajouter
  addQuartier(q: Quartier): Observable<Quartier>{
    return this.httpClient.post<Quartier>(this.url + 'quartier/ajouter', q);
  }

  // Modification d'une occurrence de quartier;
  // url: http://localhost:4040/api/quartier/modifier/{id}
  updateQuartier(id: number, q: Quartier): Observable<Quartier>{
    return this.httpClient.put<Quartier>(this.url + 'quartier/modifier/'+ id, q);
  }

  // Recherche d'une occurrence de quartier par la clé primaire ;
  // url: http://localhost:4040/api/quartier/{id}
  findById(id: number): Observable<Quartier>{
    return this.httpClient.get<Quartier>(this.url + 'quartier/' + id);
  }

  // Affichage de toutes les occurrences des quartiers;
  // url: http://localhost:4040/api/quartiers
  getAll(): Observable<Array<Quartier>>{
    return this.httpClient.get<Array<Quartier>>(this.url + 'quartiers');
  }

  // Affichage de toutes les occurrences de quartiers avec pagination;
  getQuartiersPagines(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Quartier>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Quartier>>(this.url + 'quartiers/pagines', {params: params});
  }

  // Affichage de toutes les occurrences de quartiers;
  // url: http://localhost:4040/api/quartiers/actifs
  getQuartiersActifs(): Observable<Array<Quartier>>{
    return this.httpClient.get<Array<Quartier>>(this.url + 'quartiers/actifs');
  }

  // Affichage de toutes les occurrences de quartiers par id de ville;
  // url: http://localhost:4040/api/quartiers/ville/{id}
  getQuartiersByVilleId(id: number): Observable<Array<Quartier>>{
    return this.httpClient.get<Array<Quartier>>(this.url + 'quartiers/ville/' + id);
  }

  // Activation d'un quartier;
  // url: http://localhost:4040/api/activer/quartier/{id}
  activerQuartier(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/quartier/' + id);
  }

  // Désactivation d'un quartier;
  // url: http://localhost:4040/api/desactiver/quartier/{id}
  desactiverQuartier(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/quartier/' + id);
  }
}
