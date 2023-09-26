import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Notaire } from 'src/app/models/gestionDesComptes/Notaire';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaireService {

  public notaire: Notaire = new Notaire();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/notaire/ajouter
  addNotaire(a: Notaire): Observable<Notaire>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<Notaire>(this.url + 'notaire/ajouter', a , { headers });
  }

  // url: http://localhost:4040/api/notaire/modifier/{id}
  updateNotaire(id: number, n: Notaire): Observable<Notaire>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<Notaire>(this.url + 'notaire/modifier/'+ id, n , { headers });
  }

  // url: http://localhost:4040/api/notaire/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'notaire/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/notaires
  getAll(): Observable<Array<Notaire>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Notaire>>(this.url + 'notaires', { headers });
  }

  // url: http://localhost:4040/api/notaire/{id}
  findById(id: number): Observable<Notaire>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Notaire>(this.url + 'notaire/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/notaires
  countNotaires(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/notaires');
  };
}
