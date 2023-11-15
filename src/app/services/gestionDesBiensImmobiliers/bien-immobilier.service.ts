import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  // Affichage de toutes les occurrences des biens immobiliers;
  // url: http://localhost:4040/api/biens-immobiliers
  getAll(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers');
  }

  // Affichage de toutes les occurrences des biens immobiliers;
  // url: http://localhost:4040/api/biens-immobiliers/proprietaire
  getAllByProprietaire(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/proprietaire');
  }

  // Affichage de toutes les occurrences des biens immobiliers par agent immobilier;
  // url: http://localhost:4040/api/biens-immobiliers/agent-immobilier
  getAllByAgentImmobilier(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/agent-immobilier');
  }

  // Affichage de toutes les occurrences des biens immobiliers par gérant;
  // url: http://localhost:4040/api/biens-immobiliers/gerant
  getAllByGerant(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/gerant');
  }

  // url: http://localhost:4040/api/activer/bien-immobilier/{id}
  activerBienImmobilier(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer/bien-immobilier/' + id);
  }

  // url: http://localhost:4040/api/desactiver/bien-immobilier/{id}
  desactiverBienImmobilier(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver/bien-immobilier/' + id);
  }

  // Affichage du nombre d'occurrences de biens immobiliers par propriétaire.
  // url: http://localhost:4040/api/count/biens-immobiliers/proprietaire
  countBienImmobilierParProprietaire(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/biens-immobiliers/proprietaire');
  };

  // Affichage du nombre d'occurrences de biens immobiliers par agent immobilier.
  // url: http://localhost:4040/api/count/biens-immobiliers/agent-immobilier
  countBienImmobilierParAgentImmobilier(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/biens-immobiliers/agent-immobilier');
  };

  // Affichage du nombre d'occurrences de biens immobiliers par gérant.
  // url: http://localhost:4040/api/count/biens-immobiliers/gerant
  countBienImmobilierParGerant(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/biens-immobiliers/gerant');
  };
}
