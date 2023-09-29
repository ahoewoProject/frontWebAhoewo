import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Administrateur } from 'src/app/models/gestionDesComptes/Administrateur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurService {

  public administrateur: Administrateur = new Administrateur();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/administrateur/ajouter
  addAdministrateur(a: Administrateur): Observable<Administrateur>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<Administrateur>(this.url + 'administrateur/ajouter', a , { headers });
  }

  // url: http://localhost:4040/api/administrateur/modifier/{id}
  updateAdministrateur(id: number, a: Administrateur): Observable<Administrateur>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<Administrateur>(this.url + 'administrateur/modifier/'+ id, a , { headers });
  }

  // url: http://localhost:4040/api/administrateur/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'administrateur/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/administrateurs
  getAll(): Observable<Array<Administrateur>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Administrateur>>(this.url + 'administrateurs', { headers });
  }

  // url: http://localhost:4040/api/administrateur/{id}
  findById(id: number): Observable<Administrateur>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Administrateur>(this.url + 'administrateur/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/administrateurs
  countAdministrateurs(): Observable<number>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<number>(this.url + 'count/administrateurs', { headers });
  };
}
