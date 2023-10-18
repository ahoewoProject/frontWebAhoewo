import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentImmobilierService {

  public agentImmobilier: AgentImmobilier = new AgentImmobilier();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/agent-immobilier/ajouter
  addAgentImmobilier(a: AgentImmobilier): Observable<AgentImmobilier>{
    return this.httpClient.post<AgentImmobilier>(this.url + 'agent-immobilier/ajouter', a);
  }

  // url: http://localhost:4040/api/agent-immobilier/modifier/{id}
  updateAgentImmobilier(id: number, a: AgentImmobilier): Observable<AgentImmobilier>{
    return this.httpClient.put<AgentImmobilier>(this.url + 'agent-immobilier/modifier/'+ id, a);
  }

  // url: http://localhost:4040/api/agent-immobilier/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'agent-immobilier/supprimer/' + id);
  }

  // url: http://localhost:4040/api/agents-immobiliers
  getAll(): Observable<Array<AgentImmobilier>>{
    return this.httpClient.get<Array<AgentImmobilier>>(this.url + 'agents-immobiliers');
  }

  // url: http://localhost:4040/api/agent-immobilier/{id}
  findById(id: number): Observable<AgentImmobilier>{
    return this.httpClient.get<AgentImmobilier>(this.url + 'agent-immobilier/' + id);
  }

  // url: http://localhost:4040/api/count/agents-immobiliers
  countAgentImmobiliers(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/agents-immobiliers');
  };
}
