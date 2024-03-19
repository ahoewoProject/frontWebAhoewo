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

  // Recherche d'une occurrence de notification par la clé primaire ;
  // url: http://localhost:4040/api/motif-rejet/{code}
  findByCode(code: string): Observable<MotifRejet>{
    return this.httpClient.get<MotifRejet>(this.url + 'motif-rejet/' + code);
  }
}
