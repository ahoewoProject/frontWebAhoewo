import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  public ville: Ville = new Ville();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de ville;
  // url: http://localhost:4040/api/ville/ajouter
  addVille(v: Ville): Observable<Ville>{
    return this.httpClient.post<Ville>(this.url + 'ville/ajouter', v);
  }

  // Modification d'une occurrence de ville;
  // url: http://localhost:4040/api/ville/modifier/{id}
  updateVille(id: number, v: Ville): Observable<Ville>{
    return this.httpClient.put<Ville>(this.url + 'ville/modifier/'+ id, v);
  }

  // Recherche d'une occurrence d'une ville par la clé primaire ;
  // url: http://localhost:4040/api/ville/{id}
  findById(id: number): Observable<Ville>{
    return this.httpClient.get<Ville>(this.url + 'ville/' + id);
  }

  // Affichage de toutes les occurrences des villes;
  // url: http://localhost:4040/api/villes
  getAll(): Observable<Array<Ville>>{
    return this.httpClient.get<Array<Ville>>(this.url + 'villes');
  }

  // Affichage de toutes les occurrences des villes;
  // url: http://localhost:4040/api/villes/actifs
  getVillesActives(): Observable<Array<Ville>>{
    return this.httpClient.get<Array<Ville>>(this.url + 'villes/actifs');
  }

  // Activation d'une ville;
  // url: http://localhost:4040/api/activer/ville/{id}
  activerVille(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/ville/' + id);
  }

  // Désactivation d'une ville;
  // url: http://localhost:4040/api/desactiver/ville/{id}
  desactiverVille(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/ville/' + id);
  }
}
