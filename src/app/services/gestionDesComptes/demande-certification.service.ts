import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  // url: http://localhost:4040/api/demande-certification/ajouter
  addDemandeCertif(d: FormData): Observable<DemandeCertification>{
    return this.httpClient.post<DemandeCertification>(this.url + 'demande-certification/ajouter', d);
  }

  // url: http://localhost:4040/api/demandes-certifications
  getAll(): Observable<Array<DemandeCertification>>{
    return this.httpClient.get<Array<DemandeCertification>>(this.url + 'demandes-certifications');
  }

  // url: http://localhost:4040/api/user/demande-certification
  findByUser(): Observable<Array<DemandeCertification>>{
    return this.httpClient.get<Array<DemandeCertification>>(this.url + 'user/demande-certification');
  }

  // url: http://localhost:4040/api/demande-certification/{id}
  findById(id: number): Observable<DemandeCertification>{
    return this.httpClient.get<DemandeCertification>(this.url + 'demande-certification/' + id);
  }

  // url: http://localhost:4040/api/certifier/user/{idPersonne}/{idDemandeCertif}
  certifierCompte(idPersonne: number, idDemandeCertif: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'certifier/user/' + idPersonne + '/' + idDemandeCertif);
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
}
