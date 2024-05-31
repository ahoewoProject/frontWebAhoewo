import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeCertificationService {

  public demandeCertification: DemandeCertification = new DemandeCertification();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Affichage des demandes de certifications paginées;
  // url: http://localhost:4040/api/demandes-certifications
  getDemandesCertifications(numeroDeLaPage: number, elementsParPage: number): Observable<Page<DemandeCertification>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<DemandeCertification>>(this.url + 'demandes-certifications', {params: params});
  }

  // url: http://localhost:4040/api/user/demande-certification
  findByUser(): Observable<Array<DemandeCertification>>{
    return this.httpClient.get<Array<DemandeCertification>>(this.url + 'user/demande-certification');
  }

  // url: http://localhost:4040/api/compte/demande-certification/ajouter
  addDemandeCertificationCompte(d: FormData): Observable<DemandeCertification>{
    return this.httpClient.post<DemandeCertification>(this.url + 'compte/demande-certification/ajouter', d);
  }

  // url: http://localhost:4040/api/agence/demande-certification/ajouter
  addDemandeCertificationAgence(d: FormData): Observable<DemandeCertification>{
    return this.httpClient.post<DemandeCertification>(this.url + 'agence/demande-certification/ajouter', d);
  }

  // url: http://localhost:4040/api/demande-certification/{id}
  findById(id: number): Observable<DemandeCertification>{
    return this.httpClient.get<DemandeCertification>(this.url + 'demande-certification/' + id);
  }

  // url: http://localhost:4040/api/certifier/user/{idPersonne}/{idDemandeCertif}
  certifierCompte(idPersonne: number, idDemandeCertif: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'certifier/user/' + idPersonne + '/' + idDemandeCertif);
  }

  // url: http://localhost:4040/api/certifier/agence/{idAgence}/{idDemandeCertif}
  certifierAgence(idAgence: number, idDemandeCertif: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'certifier/agence/' + idAgence + '/' + idDemandeCertif);
  }

  // url: http://localhost:4040/api/count/demandes-certifications
  countDemandeCertifications(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/demandes-certifications');
  };

  // url: http://localhost:4040/api/count/demandes-certifications/validees
  countDemandeCertificationsValidees(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/demandes-certifications/validees');
  };

  // url: http://localhost:4040/api/count/demandes-certifications/en-attente
  countDemandeCertificationsEnAttente(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/demandes-certifications/en-attente');
  };

  // url: http://localhost:4040/api/carte-cfe/demande-certification/{id}
  telechargerCarteCfe(id: number): Observable<any> {
    return this.httpClient.get(this.url + 'carte-cfe/demande-certification/' + id, { responseType: 'blob' });
  }

  telechargerCni(id: number): Observable<any> {
    return this.httpClient.get(this.url + 'cni/demande-certification/' + id, { responseType: 'blob' });
  }
}
