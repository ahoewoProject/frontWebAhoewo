import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentImmobilierService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/agents-immobiliers
  getAll(): Observable<Array<AgentImmobilier>>{
    return this.httpClient.get<Array<AgentImmobilier>>(this.url + 'agents-immobiliers');
  }
}
