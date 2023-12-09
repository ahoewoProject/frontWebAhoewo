import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  public region: Region = new Region();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence de region;
  // url: http://localhost:4040/api/region/ajouter
  addRegion(r: Region): Observable<Region>{
    return this.httpClient.post<Region>(this.url + 'region/ajouter', r);
  }

  // Modification d'une occurrence de region;
  // url: http://localhost:4040/api/region/modifier/{id}
  updateRegion(id: number, r: Region): Observable<Region>{
    return this.httpClient.put<Region>(this.url + 'region/modifier/'+ id, r);
  }

  // Recherche d'une occurrence de region par la clé primaire ;
  // url: http://localhost:4040/api/region/{id}
  findById(id: number): Observable<Region>{
    return this.httpClient.get<Region>(this.url + 'region/' + id);
  }

  // Affichage de toutes les occurrences de regions;
  // url: http://localhost:4040/api/regions
  getAll(): Observable<Array<Region>>{
    return this.httpClient.get<Array<Region>>(this.url + 'regions');
  }

  // Affichage de toutes les occurrences de regions avec pagination;
  getRegionsPaginees(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Region>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Region>>(this.url + 'regions/paginees', {params: params});
  }

  // Affichage de toutes les occurrences des regions;
  // url: http://localhost:4040/api/regions/actifs
  getRegionsActives(): Observable<Array<Region>>{
    return this.httpClient.get<Array<Region>>(this.url + 'regions/actifs');
  }

  // Activation d'une region;
  // url: http://localhost:4040/api/activer/ville/{id}
  activerRegion(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/region/' + id);
  }

  // Désactivation d'une region;
  // url: http://localhost:4040/api/desactiver/region/{id}
  desactiverRegion(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/region/' + id);
  }
}
