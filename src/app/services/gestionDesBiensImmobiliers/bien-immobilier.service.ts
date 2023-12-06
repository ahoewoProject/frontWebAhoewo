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

  // Affichage de toutes les occurrences des biens immobiliers par propriétaire;
  // url: http://localhost:4040/api/biens-immobiliers/proprietaire
  getAllByProprietaire(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/proprietaire');
  }

  // Affichage de toutes les occurrences des biens immobiliers par agence;
  // url: http://localhost:4040/api/biens-immobiliers/agences/responsable
  getBiensOfAgencesByResponsable(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/agences/responsable');
  }

  // Affichage de toutes les occurrences des biens immobiliers par agence;
  // url: http://localhost:4040/api/biens-immobiliers/agences/agent
  getBiensOfAgencesByAgent(): Observable<Array<BienImmobilier>>{
    return this.httpClient.get<Array<BienImmobilier>>(this.url + 'biens-immobiliers/agences/agent');
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

  // Fonction pour afficher la premiere image d'un bien immobilier
  getPremiereImage(id: number): Observable<any> {
    const endpoint = this.url + 'premiere-image/bien-immobilier/' + id;

    return this.httpClient.get(endpoint, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}