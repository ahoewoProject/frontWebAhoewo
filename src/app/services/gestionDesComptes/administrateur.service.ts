import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Administrateur } from 'src/app/models/gestionDesComptes/Administrateur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurService {

  public administrateur: Administrateur = new Administrateur();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/administrateur/ajouter
  addAdministrateur(a: Administrateur): Observable<Administrateur>{
    return this.httpClient.post<Administrateur>(this.url + 'administrateur/ajouter', a);
  }

  // url: http://localhost:4040/api/administrateur/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'administrateur/supprimer/' + id);
  }

  // url: http://localhost:4040/api/administrateurs
  getAll(): Observable<Array<Administrateur>>{
    return this.httpClient.get<Array<Administrateur>>(this.url + 'administrateurs');
  }

  // url: http://localhost:4040/api/administrateurs/pagines?numeroDeLaPage=0&elementsParPage=5
  getAdministrateurs(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Administrateur>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Administrateur>>(this.url + 'administrateurs/pagines', {params: params});
  }

  // url: http://localhost:4040/api/administrateur/{id}
  findById(id: number): Observable<Administrateur>{
    return this.httpClient.get<Administrateur>(this.url + 'administrateur/' + id);
  }

  // url: http://localhost:4040/api/count/administrateurs
  countAdministrateurs(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/administrateurs');
  };
}
