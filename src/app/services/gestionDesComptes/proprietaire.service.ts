import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Proprietaire } from 'src/app/models/gestionDesComptes/Proprietaire';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {

  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/proprietaire/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'proprietaire/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/proprietaires
  getAll(): Observable<Array<Proprietaire>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Proprietaire>>(this.url + 'proprietaires', { headers });
  }

  // url: http://localhost:4040/api/proprietaire/{id}
  findById(id: number): Observable<Proprietaire>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Proprietaire>(this.url + 'proprietaire/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/proprietaires
  countProprietaires(): Observable<number>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<number>(this.url + 'count/proprietaires', { headers });
  };
}
