import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsableAgenceImmobiliereService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/responsable-agence-immobiliere/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'responsable-agence-immobiliere/supprimer/' + id);
  }

  // url: http://localhost:4040/api/responsable-agence-immobiliere
  getAll(): Observable<Array<ResponsableAgenceImmobiliere>>{
    return this.httpClient.get<Array<ResponsableAgenceImmobiliere>>(this.url + 'responsables-agence-immobiliere');
  }

  // url: http://localhost:4040/api/responsable-agence-immobiliere/{id}
  findById(id: number): Observable<ResponsableAgenceImmobiliere>{
    return this.httpClient.get<ResponsableAgenceImmobiliere>(this.url + 'responsable-agence-immobiliere/' + id);
  }

  // url: http://localhost:4040/api/count/responsables-agence-immobilier
  countResponsablesAgenceImmobiliere(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/responsables-agence-immobiliere');
  };
}
