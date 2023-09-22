import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Gerant } from 'src/app/models/gestionDesComptes/Gerant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerantService {

  public gerant: Gerant = new Gerant();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/gerant/ajouter
  addGerant(g: Gerant): Observable<Gerant>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<Gerant>(this.url + 'gerant/ajouter', g , { headers });
  }

  // url: http://localhost:4040/api/gerant/modifier/{id}
  updateGerant(id: number, g: Gerant): Observable<Gerant>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<Gerant>(this.url + 'gerant/modifier/'+ id, g , { headers });
  }

  // url: http://localhost:4040/api/gerant/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'gerant/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/gerants
  getAll(): Observable<Array<Gerant>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Gerant>>(this.url + 'gerants', { headers });
  }

  // url: http://localhost:4040/api/gerants-proprietaire
  findGerantsByProprietaire(): Observable<Array<Gerant>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Gerant>>(this.url + 'gerants-proprietaire', { headers });
  }

  // url: http://localhost:4040/api/gerant/{id}
  findById(id: number): Observable<Gerant>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Gerant>(this.url + 'gerant/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/gerants
  countGerants(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/gerants');
  };
}
