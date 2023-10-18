import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gerant } from 'src/app/models/gestionDesComptes/Gerant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerantService {

  public gerant: Gerant = new Gerant();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/gerant/ajouter
  addGerant(g: Gerant): Observable<Gerant>{
    return this.httpClient.post<Gerant>(this.url + 'gerant/ajouter', g);
  }

  // url: http://localhost:4040/api/gerant/modifier/{id}
  updateGerant(id: number, g: Gerant): Observable<Gerant>{
    return this.httpClient.put<Gerant>(this.url + 'gerant/modifier/'+ id, g);
  }

  // url: http://localhost:4040/api/gerant/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'gerant/supprimer/' + id);
  }

  // url: http://localhost:4040/api/gerants
  getAll(): Observable<Array<Gerant>>{
    return this.httpClient.get<Array<Gerant>>(this.url + 'gerants');
  }

  // url: http://localhost:4040/api/gerants-proprietaire
  findGerantsByProprietaire(): Observable<Array<Gerant>>{
    return this.httpClient.get<Array<Gerant>>(this.url + 'gerants-proprietaire');
  }

  // url: http://localhost:4040/api/gerant/{id}
  findById(id: number): Observable<Gerant>{
    return this.httpClient.get<Gerant>(this.url + 'gerant/' + id);
  }

  // url: http://localhost:4040/api/count/gerants
  countGerants(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/gerants');
  };

  // url: http://localhost:4040/api/count/gerants-proprietaire
  countGerantsByProprietaire(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/gerants-proprietaire');
  };
}
