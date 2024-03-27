import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MotifRejet } from '../models/MotifRejet';

@Injectable({
  providedIn: 'root'
})
export class MotifRejetService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Liste motfis de rejet (code et creerPar) ;
  // url: http://localhost:4040/api/motifs-rejets/{code}/{creerPar}
  getMotifsByCodeAndCreerPar(code: string, creerPar: number): Observable<Array<MotifRejet>>{
    return this.httpClient.get<Array<MotifRejet>>(this.url + 'motifs-rejets/' + code + '/' + creerPar);
  }

  // Recherche d'une occurrence de notification par la clé primaire ;
  // url: http://localhost:4040/api/motif-rejet/{code}
  findByCode(code: string): Observable<MotifRejet>{
    return this.httpClient.get<MotifRejet>(this.url + 'motif-rejet/' + code);
  }
}
