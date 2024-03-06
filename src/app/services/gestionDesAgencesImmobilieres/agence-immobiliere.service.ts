import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenceImmobiliereService {

  public agenceImmobiliere: AgenceImmobiliere = new AgenceImmobiliere();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  //Affichage des agences immobilières actives par region
  // url: http://localhost:4040/api/agences/actives/region/{id}
  getAgencesActivesByRegionId(id: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<AgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AgenceImmobiliere>>(this.url + 'agences/actives/region/' + id, {params: params});
  }

    //Affichage des agences immobilières actives par ville
  // url: http://localhost:4040/api/agences/actives/ville/{id}
  getAgencesActivesByVilleId(id: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<AgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AgenceImmobiliere>>(this.url + 'agences/actives/ville/' + id, {params: params});
  }

    //Affichage des agences immobilières actives par quartier
  // url: http://localhost:4040/api/agences/actives/quartier/{id}
  getAgencesActivesByQuartierId(id: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<AgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AgenceImmobiliere>>(this.url + 'agences/actives/quartier/' + id, {params: params});
  }


  //Affichage des agences immobilières actives
  // url: http://localhost:4040/api/agences-immobilieres/actives
  getAgencesActives(numeroDeLaPage: number, elementsParPage: number): Observable<Page<AgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AgenceImmobiliere>>(this.url + 'agences-immobilieres/actives', {params: params});
  }

  //Affiche d'une agence immobilière à partir de son nom;
  // url: http://localhost:4040/api/agence/{nom}
  findAgenceByNom(nomAgence: string): Observable<AgenceImmobiliere>{
    return this.httpClient.get<AgenceImmobiliere>(this.url + 'agence/' + nomAgence);
  }

  // Affichage de toutes les occurrences d'agence immobilière;
  // url: http://localhost:4040/api/agences-immobilieres
  getAll(): Observable<Array<AffectationResponsableAgence>>{
    return this.httpClient.get<Array<AffectationResponsableAgence>>(this.url + 'agences-immobilieres');
  }

  // Affichage de toutes les occurrences d'agence immobilière par responsable d'agence immobilière;
  // url: http://localhost:4040/api/agences-immobilieres/responsable
  findAgencesByResponsable(): Observable<Array<AgenceImmobiliere>>{
    return this.httpClient.get<Array<AgenceImmobiliere>>(this.url + 'agences-immobilieres/responsable');
  }

    // Affichage de toutes les occurrences d'agence immobilière paginées;
  // url: http://localhost:4040/api/agences-immobilieres/paginees
  getAffectationsResponsableAgence(numeroDeLaPage: number, elementsParPage: number): Observable<Page<AffectationResponsableAgence>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AffectationResponsableAgence>>(this.url + 'agences-immobilieres/paginees', {params: params});
  }

  // Affichage de toutes les occurrences d'agence immobilière paginées par responsable d'agence immobilière;
  // url: http://localhost:4040/api/agences-immobilieres/responsable/paginees
  findAgencesByResponsablePaginees(numeroDeLaPage: number, elementsParPage: number): Observable<Page<AgenceImmobiliere>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<AgenceImmobiliere>>(this.url + 'agences-immobilieres/responsable/paginees', {params: params});
  }

  // Affichage de toutes les occurrences d'agence immobilière par agent immobilier;
  // url: http://localhost:4040/api/agences-immobilieres/agent
  findAgencesByAgent(): Observable<Array<AgenceImmobiliere>>{
    return this.httpClient.get<Array<AgenceImmobiliere>>(this.url + 'agences-immobilieres/agent');
  }

  // Recherche d'une occurrence d'agence immobiliere par la clé primaire ;
  // url: http://localhost:4040/api/agence-immobiliere/{id}
  findById(id: number): Observable<AgenceImmobiliere>{
    return this.httpClient.get<AgenceImmobiliere>(this.url + 'agence-immobiliere/' + id);
  }

  // Recherche d'une occurrence d'affectation responsable agence par la clé primaire ;
  // url: http://localhost:4040/api/affectation-responsable-agence/{id}
  detailAffectation(id: number): Observable<AffectationResponsableAgence>{
    return this.httpClient.get<AffectationResponsableAgence>(this.url + 'affectation-responsable-agence/' + id);
  }

  // Ajout d'une occurrence d'agence immobilière;
  // url: http://localhost:4040/api/agence-immmobiliere/ajouter
  addAgenceImmobiliere(a: FormData): Observable<AgenceImmobiliere>{
    return this.httpClient.post<AgenceImmobiliere>(this.url + 'agence-immobiliere/ajouter', a);
  }

  // Modification d'une occurrence d'agence immobiliere;
  // url: http://localhost:4040/api/agence-immobiliere/modifier/{id}
  updateAgenceImmobiliere(id: number, a: FormData): Observable<AgenceImmobiliere>{
    return this.httpClient.put<AgenceImmobiliere>(this.url + 'agence-immobiliere/modifier/'+ id, a);
  }

  // Suppression d'une occurrence d'une agence immobiliere par la clé primaire ;
  // url: http://localhost:4040/api/agence-immobiliere/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'agence-immobiliere/supprimer/' + id);
  }

  // url: http://localhost:4040/api/activer/agence-immobiliere/{id}
  activerAgence(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer/agence-immobiliere/' + id);
  }

  // url: http://localhost:4040/api/desactiver/agence-immobiliere/{id}
  desactiverAgence(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver/agence-immobiliere/' + id);
  }
}
