import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Proprietaire } from 'src/app/models/gestionDesComptes/Proprietaire';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/proprietaire/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'proprietaire/supprimer/' + id);
  }

  // url: http://localhost:4040/api/proprietaires
  getAll(): Observable<Array<Proprietaire>>{
    return this.httpClient.get<Array<Proprietaire>>(this.url + 'proprietaires');
  }

  // url: http://localhost:4040/api/proprietaires/pagines?numeroDeLaPage=0&elementsParPage=5
  getProprietaires(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Proprietaire>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Proprietaire>>(this.url + 'proprietaires/pagines', {params: params});
  }

  // url: http://localhost:4040/api/proprietaire/{id}
  findById(id: number): Observable<Proprietaire>{
    return this.httpClient.get<Proprietaire>(this.url + 'proprietaire/' + id);
  }

  // url: http://localhost:4040/api/count/proprietaires
  countProprietaires(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/proprietaires');
  };
}
