import { HttpClient, HttpParams } from '@angular/common/http';
import { BienImmobilierAssocie } from './../../models/gestionDesBiensImmobiliers/BienImmAssocie';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';

@Injectable({
  providedIn: 'root'
})
export class BienImmAssocieService {

  public bienImmobilierAssocie: BienImmobilierAssocie = new BienImmobilierAssocie();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage de toutes les occurrences des biens associes;
  // url: http://localhost:4040/api/biens-associes
  getBiensAssocies(): Observable<Array<BienImmobilierAssocie>>{
    return this.httpClient.get<Array<BienImmobilierAssocie>>(this.url + 'biens-associes');
  }

  // Ajout d'une occurrence d'un bien imm associé;
  // url: http://localhost:4040/api/bien-imm-associe/ajouter
  addBienImmAssocie(b: FormData): Observable<BienImmobilierAssocie>{
    return this.httpClient.post<BienImmobilierAssocie>(this.url + 'bien-imm-associe/ajouter', b);
  }

  // Modification d'une occurrence d'un bien imm associé;
  // url: http://localhost:4040/api/bien-imm-associe/modifier/{id}
  updateBienImmAssocie(id: number, b: FormData): Observable<BienImmobilierAssocie>{
    return this.httpClient.put<BienImmobilierAssocie>(this.url + 'bien-imm-associe/modifier/'+ id, b);
  }

  // Recherche d'une occurrence d'un bien imm associé par la clé primaire ;
  // url: http://localhost:4040/api/bien-imm-associe/{id}
  findById(id: number): Observable<BienImmobilierAssocie>{
    return this.httpClient.get<BienImmobilierAssocie>(this.url + 'bien-imm-associe/' + id);
  }

  // Affichage de toutes les occurrences de biens imm associés paginés par propriétaire;
  // url: http://localhost:4040/api/biens-imm-associes/pagines/{id}
  getBiensAssociesPaginesByBienImmobilier(id: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<BienImmobilierAssocie>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<BienImmobilierAssocie>>(this.url + 'biens-imm-associes/pagines/' + id, {params: params});
  }
}
