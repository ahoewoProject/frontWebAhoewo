import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public role: Role = new Role();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de role;
  // url: http://localhost:4040/api/role/ajouter
  addRole(r: Role): Observable<Role>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<Role>(this.url + 'role/ajouter', r , { headers });
  }

  // Modification d'une occurrence de role;
  // url: http://localhost:4040/api/role/modifier
  updateRole(id: number, r: Role): Observable<Role>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<Role>(this.url + 'role/modifier/'+ id, r , { headers });
  }

  // Suppression d'une occurrence de role par la clé primaire ;
  // url: http://localhost:4040/api/role/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'role/supprimer/' + id, { headers });
  }

  // Affichage de toutes les occurrences de roles;
  // url: http://localhost:4040/api/roles
  getAll(): Observable<Array<Role>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<Role>>(this.url + 'roles', { headers });
  }

  // Recherche d'une occurrence de role par la clé primaire ;
  // url: http://localhost:4040/api/role/{id}
  findById(id: number): Observable<Role>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Role>(this.url + 'role/' + id, { headers });
  }

  // Affichage du nombre d'occurrences de role.
  // url: http://localhost:4040/api/role/count
  countRoles(): Observable<number>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<number>(this.url + 'count/roles', { headers });
  };

}
