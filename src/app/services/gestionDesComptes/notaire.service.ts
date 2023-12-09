import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Notaire } from 'src/app/models/gestionDesComptes/Notaire';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaireService {

  public notaire: Notaire = new Notaire();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/notaire/ajouter
  addNotaire(a: Notaire): Observable<Notaire>{
    return this.httpClient.post<Notaire>(this.url + 'notaire/ajouter', a);
  }

  // url: http://localhost:4040/api/notaire/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'notaire/supprimer/' + id);
  }

  // url: http://localhost:4040/api/notaires
  getAll(): Observable<Array<Notaire>>{
    return this.httpClient.get<Array<Notaire>>(this.url + 'notaires');
  }

  // url: http://localhost:4040/api/notaires/pagines?numeroDeLaPage=0&elementsParPage=5
  getNotaires(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Notaire>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Notaire>>(this.url + 'notaires/pagines', {params: params});
  }

  // url: http://localhost:4040/api/notaire/{id}
  findById(id: number): Observable<Notaire>{
    return this.httpClient.get<Notaire>(this.url + 'notaire/' + id);
  }

  // url: http://localhost:4040/api/count/notaires
  countNotaires(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/notaires');
  };
}
