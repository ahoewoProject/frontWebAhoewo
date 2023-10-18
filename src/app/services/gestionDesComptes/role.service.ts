import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public role: Role = new Role();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de role;
  // url: http://localhost:4040/api/role/ajouter
  addRole(r: Role): Observable<Role>{
    return this.httpClient.post<Role>(this.url + 'role/ajouter', r);
  }

  // Modification d'une occurrence de role;
  // url: http://localhost:4040/api/role/modifier
  updateRole(id: number, r: Role): Observable<Role>{
    return this.httpClient.put<Role>(this.url + 'role/modifier/'+ id, r);
  }

  // Suppression d'une occurrence de role par la clé primaire ;
  // url: http://localhost:4040/api/role/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'role/supprimer/' + id);
  }

  // Affichage de toutes les occurrences de roles;
  // url: http://localhost:4040/api/roles
  getAll(): Observable<Array<Role>>{
    return this.httpClient.get<Array<Role>>(this.url + 'roles');
  }

  // Recherche d'une occurrence de role par la clé primaire ;
  // url: http://localhost:4040/api/role/{id}
  findById(id: number): Observable<Role>{
    return this.httpClient.get<Role>(this.url + 'role/' + id);
  }

  // Affichage du nombre d'occurrences de role.
  // url: http://localhost:4040/api/role/count
  countRoles(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/roles');
  };

}
