import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Demarcheur } from 'src/app/models/gestionDesComptes/Demarcheur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemarcheurService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/demarcheur/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'demarcheur/supprimer/' + id);
  }

  // url: http://localhost:4040/api/demarcheurs
  getAll(): Observable<Array<Demarcheur>>{
    return this.httpClient.get<Array<Demarcheur>>(this.url + 'demarcheurs');
  }

  // url: http://localhost:4040/api/demarcheurs/pagines?numeroDeLaPage=0&elementsParPage=5
  getDemarcheurs(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Demarcheur>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Demarcheur>>(this.url + 'demarcheurs/pagines', {params: params});
  }

  // url: http://localhost:4040/api/demarcheur/{id}
  findById(id: number): Observable<Demarcheur>{
    return this.httpClient.get<Demarcheur>(this.url + 'demarcheur/' + id);
  }

  // url: http://localhost:4040/api/count/demarcheurs
  countDemarcheurs(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/demarcheurs');
  };
}
