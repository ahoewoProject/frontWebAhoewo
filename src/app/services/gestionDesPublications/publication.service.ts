import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { RechercheAvanceePublicationForm } from 'src/app/models/gestionDesPublications/RechercheAvanceePublicationForm';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  public publication: Publication = new Publication();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Liste publications Par Utilisateurs ;
  // url: http://localhost:4040/api/publications/user
  getPublicationsByUser(): Observable<Array<Publication>>{
    return this.httpClient.get<Array<Publication>>(this.url + 'publications/user');
  }

  // Les publications actives par agence;
  // url: http://localhost:4040/api/publications/actives/agence/{nomAgence}
  getPublicationsActivesByAgence(nomAgence: string, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/agence/' + nomAgence, {params: params});
  }

  // Les publications actives par personne;
  // url: http://localhost:4040/api/publications/actives/personne/{email}
  getPublicationsActivesByPersonne(email: string, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/personne/' + email, {params: params});
  }

  // Les publications actives par region;
  // url: http://localhost:4040/api/publications/actives/region/{libelle}
  getPublicationsActivesByRegion(libelle: string, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/region/' + libelle, {params: params});
  }

  // Les publications actives par liste de regions actives;
  // url: http://localhost:4040/api/publications/actives/region-list
  getPublicationsActivesByRegionList(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/region-list', {params: params});
  }

  // Les publications actives par type de bien;
  // url: http://localhost:4040/api/publications/actives/type-de-bien/{designation}
  getPublicationsActivesByTypeDeBien(designation: string, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/type-de-bien/' + designation, {params: params});
  }

  // Les publications actives par liste de types de biens actifs;
  // url: http://localhost:4040/api/publications/actives/type-de-bien-list
  getPublicationsActivesByTypeDeBienList(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/type-de-bien-list', {params: params});
  }


  // Recherche simple des publications actives;
  // url: http://localhost:4040/api/publications/actives/recherche-simple
  rechercheSimpleDePublicationsActives(typeDeTransaction: string, typeDeBienId: number,
    quartierId: number, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{

    let params = new HttpParams()
      .set('typeDeTransaction', typeDeTransaction)
      .set('typeDeBienId', typeDeBienId.toString())
      .set('quartierId', quartierId.toString())
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/recherche-simple', {params: params});
  }

  // Recherche avancée des publications actives;
  // url: http://localhost:4040/api/publications/actives/recherche-avancee
  rechercheAvanceeDePublicationsActives(rechercheAvanceePublicationForm: RechercheAvanceePublicationForm, numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.post<Page<Publication>>(this.url + 'publications/actives/recherche-avancee', rechercheAvanceePublicationForm, {params: params});
  }

  // Affichage des publications actives par type de transaction -Location- paginées;
  // url: http://localhost:4040/api/publications/actives/location
  getPublicationsActivesByLocation(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/location', {params: params});
  }

  // Affichage des publications actives par type de transaction -Vente- paginées;
  // url: http://localhost:4040/api/publications/actives/vente
  getPublicationsActivesByVente(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives/vente', {params: params});
  }


  // Affichage des publications actives paginées;
  // url: http://localhost:4040/api/publications/actives
  getPublicationsActives(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications/actives', {params: params});
  }

  // Affichage des publications paginées;
  // url: http://localhost:4040/api/publications
  getPublications(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Publication>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Publication>>(this.url + 'publications', {params: params});
  }

  // Recherche d'une occurrence d'une publication par la clé primaire ;
  // url: http://localhost:4040/api/publication/{id}
  findById(id: number): Observable<Publication>{
    return this.httpClient.get<Publication>(this.url + 'publication/' + id);
  }

  // Recherche d'une occurence d'une publication par code;
  // url: http://localhost:4040/api/publication/code/{code}
  findByCodePublication(code: string): Observable<Publication>{
    return this.httpClient.get<Publication>(this.url + 'publication/code/' + code);
  }

  // Ajout d'une occurrence de publication;
  // url: http://localhost:4040/api/publication/ajouter
  ajouterPublication(p: Publication): Observable<Publication>{
    return this.httpClient.post<Publication>(this.url + 'publication/ajouter', p);
  }

  // Modification d'une occurrence de publication;
  // url: http://localhost:4040/api/publication/modifier/{id}
  updatePublication(id: number, p: Publication): Observable<Publication>{
    return this.httpClient.put<Publication>(this.url + 'publication/modifier/'+ id, p);
  }

  // Activation d'une publication;
  // url: http://localhost:4040/api/activer/publication/{id}
  activerPublication(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'activer/publication/' + id);
  }

  // Désactivation d'une publication;
  // url: http://localhost:4040/api/desactiver/publication/{id}
  desactiverPublication(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'desactiver/publication/' + id);
  }
}
