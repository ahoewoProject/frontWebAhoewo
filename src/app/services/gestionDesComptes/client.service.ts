import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/gestionDesComptes/Client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // url: http://localhost:4040/api/client/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'client/supprimer/' + id);
  }

  // url: http://localhost:4040/api/clients
  getAll(): Observable<Array<Client>>{
    return this.httpClient.get<Array<Client>>(this.url + 'clients');
  }

  // url: http://localhost:4040/api/client/{id}
  findById(id: number): Observable<Client>{
    return this.httpClient.get<Client>(this.url + 'client/' + id);
  }

  // url: http://localhost:4040/api/count/clients
  countClients(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/clients');
  };
}
