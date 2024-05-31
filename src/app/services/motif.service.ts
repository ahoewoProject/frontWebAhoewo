import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Motif } from '../models/Motif';

@Injectable({
  providedIn: 'root'
})
export class MotifService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Liste motfis de rejet (code et creerPar) ;
  // url: http://localhost:4040/api/motifs/{code}/{creerPar}
  getMotifsByCodeAndCreerPar(code: string, creerPar: number): Observable<Array<Motif>>{
    return this.httpClient.get<Array<Motif>>(this.url + 'motifs/' + code + '/' + creerPar);
  }

  // Recherche d'une occurrence de motif par la code motif ;
  // url: http://localhost:4040/api/motif/{code}
  findByCode(code: string): Observable<Motif>{
    return this.httpClient.get<Motif>(this.url + 'motif/' + code);
  }
}
