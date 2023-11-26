import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  public pays: Pays = new Pays();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de pays;
  // url: http://localhost:4040/api/pays/ajouter
  addPays(p: Pays): Observable<Pays>{
    return this.httpClient.post<Pays>(this.url + 'pays/ajouter', p);
  }

  // Modification d'une occurrence de pays;
  // url: http://localhost:4040/api/pays/modifier/{id}
  updatePays(id: number, p: Pays): Observable<Pays>{
    return this.httpClient.put<Pays>(this.url + 'pays/modifier/'+ id, p);
  }

  // Recherche d'une occurrence de pays par la clé primaire ;
  // url: http://localhost:4040/api/pays/{id}
  findById(id: number): Observable<Pays>{
    return this.httpClient.get<Pays>(this.url + 'pays/' + id);
  }

  // Affichage de toutes les occurrences des pays;
  // url: http://localhost:4040/api/pays
  getAll(): Observable<Array<Pays>>{
    return this.httpClient.get<Array<Pays>>(this.url + 'pays');
  }

  // Affichage de toutes les occurrences des pays;
  // url: http://localhost:4040/api/pays/actifs
  getPaysActifs(): Observable<Array<Pays>>{
    return this.httpClient.get<Array<Pays>>(this.url + 'pays/actifs');
  }

  // Activation d'un pays;
  // url: http://localhost:4040/api/activer/pays/{id}
  activerPays(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/pays/' + id);
  }

  // Désactivation d'un pays;
  // url: http://localhost:4040/api/desactiver/region/{id}
  desactiverPays(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/pays/' + id);
  }
}
