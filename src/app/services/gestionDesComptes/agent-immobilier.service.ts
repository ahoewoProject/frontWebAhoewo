import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/agent-immobilier/ajouter
  addAgentImmobilier(a: AgentImmobilier): Observable<AgentImmobilier>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.post<AgentImmobilier>(this.url + 'agent-immobilier/ajouter', a , { headers });
  }

  // url: http://localhost:4040/api/agent-immobilier/modifier/{id}
  updateAgentImmobilier(id: number, a: AgentImmobilier): Observable<AgentImmobilier>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<AgentImmobilier>(this.url + 'agent-immobilier/modifier/'+ id, a , { headers });
  }

  // url: http://localhost:4040/api/agent-immobilier/supprimer/{id}
  deleteById(id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.delete(this.url + 'agent-immobilier/supprimer/' + id, { headers });
  }

  // url: http://localhost:4040/api/agents-immobiliers
  getAll(): Observable<Array<AgentImmobilier>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Array<AgentImmobilier>>(this.url + 'agents-immobiliers', { headers });
  }

  // url: http://localhost:4040/api/agent-immobilier/{id}
  findById(id: number): Observable<AgentImmobilier>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<AgentImmobilier>(this.url + 'agent-immobilier/' + id, { headers });
  }

  // url: http://localhost:4040/api/count/agents-immobiliers
  countAgentImmobiliers(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/agents-immobiliers');
  };
}
