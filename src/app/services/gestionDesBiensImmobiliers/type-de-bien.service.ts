import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeDeBienService {

  public typeDeBien: TypeDeBien = new TypeDeBien();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence d'un type de bien;
  // url: http://localhost:4040/api/type-de-bien/ajouter
  addTypeDeBien(t: TypeDeBien): Observable<TypeDeBien>{
    return this.httpClient.post<TypeDeBien>(this.url + 'type-de-bien/ajouter', t);
  }

  // Modification d'une occurrence d'un type de bien;
  // url: http://localhost:4040/api/type-de-bien/modifier/{id}
  updateTypeDeBien(id: number, t: TypeDeBien): Observable<TypeDeBien>{
    return this.httpClient.put<TypeDeBien>(this.url + 'type-de-bien/modifier/'+ id, t);
  }

  // Recherche d'une occurrence d'un type de bien par la clé primaire ;
  // url: http://localhost:4040/api/type-de-bien/{id}
  findById(id: number): Observable<TypeDeBien>{
    return this.httpClient.get<TypeDeBien>(this.url + 'type-de-bien/' + id);
  }

  // Affichage de toutes les occurrences des types de bien;
  // url: http://localhost:4040/api/types-de-bien
  getAll(): Observable<Array<TypeDeBien>>{
    return this.httpClient.get<Array<TypeDeBien>>(this.url + 'types-de-bien');
  }

  // Affichage de toutes les occurrences des types de bien;
  // url: http://localhost:4040/api/types-de-bien
  getTypeDeBienActifs(): Observable<Array<TypeDeBien>>{
    return this.httpClient.get<Array<TypeDeBien>>(this.url + 'types-de-bien/actifs');
  }

  // Activation d'un type de bien;
  // url: http://localhost:4040/api/activer/type-de-bien
  activerTypeDeBien(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer/type-de-bien/' + id);
  }

  // Désactivation d'un type de bien;
  // url: http://localhost:4040/api/desactiver/type-de-bien
  desactiverTypeDeBien(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver/type-de-bien/' + id);
  }

  // Suppression d'une occurrence d'un type de bien par la clé primaire ;
  // url: http://localhost:4040/api/type-de-bien/supprimer/{id}
  deleteById(id: number) {
    return this.httpClient.delete(this.url + 'type-de-bien/supprimer/' + id);
  }
}
