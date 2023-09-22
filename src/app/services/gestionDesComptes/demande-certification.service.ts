import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeCertificationService {

  public demandeCertification: DemandeCertification = new DemandeCertification();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/demande-certification/ajouter
  addDemandeCertif(d: FormData): Observable<DemandeCertification>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<DemandeCertification>(this.url + 'demande-certification/ajouter', d , { headers });
  }

  // url: http://localhost:4040/api/demandes-certifications
  getAll(): Observable<Array<DemandeCertification>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<DemandeCertification>>(this.url + 'demandes-certifications', { headers });
  }

  // url: http://localhost:4040/api/user/demande-certification
  findByUser(): Observable<Array<DemandeCertification>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<DemandeCertification>>(this.url + 'user/demande-certification', { headers });
  }

  // url: http://localhost:4040/api/demande-certification/{id}
  findById(id: number): Observable<DemandeCertification>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<DemandeCertification>(this.url + 'demande-certification/' + id, { headers });
  }

  // url: http://localhost:4040/api/certifier/user/{id}
  certifierCompte(id: number): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<any>(this.url + 'certifier/user/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/demandes-certifications
  countDemandeCertifications(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/demandes-certifications');
  };
}