import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Demarcheur } from 'src/app/models/gestionDesComptes/Demarcheur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemarcheurService {

  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/demarcheur/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'demarcheur/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/demarcheurs
  getAll(): Observable<Array<Demarcheur>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Demarcheur>>(this.url + 'demarcheurs', { headers });
  }

  // url: http://localhost:4040/api/demarcheur/{id}
  findById(id: number): Observable<Demarcheur>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Demarcheur>(this.url + 'demarcheur/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/demarcheurs
  countDemarcheurs(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/demarcheurs');
  };
}
