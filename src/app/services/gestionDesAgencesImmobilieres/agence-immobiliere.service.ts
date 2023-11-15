import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenceImmobiliereService {

  public agenceImmobiliere: AgenceImmobiliere = new AgenceImmobiliere();
  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence d'agence immobilière;
  // url: http://localhost:4040/api/agence-immmobiliere/ajouter
  addAgenceImmobiliere(a: FormData): Observable<AgenceImmobiliere>{
    return this.httpClient.post<AgenceImmobiliere>(this.url + 'agence-immobiliere/ajouter', a);
  }

  // Modification d'une occurrence d'agence immobiliere;
  // url: http://localhost:4040/api/agence-immobiliere/modifier/{id}
  updateAgenceImmobiliere(id: number, a: FormData): Observable<AgenceImmobiliere>{
    return this.httpClient.put<AgenceImmobiliere>(this.url + 'agence-immobiliere/modifier/'+ id, a);
  }

  // Suppression d'une occurrence d'une agence immobiliere par la clé primaire ;
  // url: http://localhost:4040/api/agence-immobiliere/supprimer/{id}
  deleteById(id: number){
    return this.httpClient.delete(this.url + 'agence-immobiliere/supprimer/' + id);
  }

  // url: http://localhost:4040/api/activer/agence-immobiliere/{id}
  activerAgence(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'activer/agence-immobiliere/' + id);
  }

  // url: http://localhost:4040/api/desactiver/agence-immobiliere/{id}
  desactiverAgence(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'desactiver/agence-immobiliere/' + id);
  }

  // Affichage de toutes les occurrences d'agence immobilière;
  // url: http://localhost:4040/api/agences-immobilieres
  getAll(): Observable<Array<AgenceImmobiliere>>{
    return this.httpClient.get<Array<AgenceImmobiliere>>(this.url + 'agences-immobilieres');
  }

  // Affichage des occurrences d'agence immobilière par responsable d'agence immobiliere;
  // url: http://localhost:4040/api/agence-immobiliere/responsable-agence-immobiliere
  getAllByResponsableAgenceImmobiliere(): Observable<Array<AgenceImmobiliere>>{
    return this.httpClient.get<Array<AgenceImmobiliere>>(this.url + 'agence-immobiliere/responsable-agence-immobiliere');
  }

  // Affichage des occurrences d'agence immobilière par agent immobilier;
  // url: http://localhost:4040/api/agence-immobiliere/agent-immobilier
  getAgenceImmobiliereParAgentImmobilier(): Observable<Array<AgenceImmobiliere>>{
    return this.httpClient.get<Array<AgenceImmobiliere>>(this.url + 'agence-immobiliere/agent-immobilier');
  }

  // Recherche d'une occurrence d'agence immobiliere par la clé primaire ;
  // url: http://localhost:4040/api/agence-immobiliere/{id}
  findById(id: number): Observable<AgenceImmobiliere>{
    return this.httpClient.get<AgenceImmobiliere>(this.url + 'agence-immobiliere/' + id);
  }

  // Affichage du nombre d'occurrences d'agence immobiliere.
  // url: http://localhost:4040/api/count/agences-immobilieres
  countAgencesImmobilieres(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/agences-immobilieres');
  };

  // Affichage du nombre d'occurrences d'agence immobiliere par responsable d'agence immobilière.
  // url: http://localhost:4040/api/count/agences-immobilieres/responsable-agence-immobiliere
  countAgencesImmobilieresResponsable(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/agences-immobilieres/responsable-agence-immobiliere');
  };

  // Affichage du nombre d'occurrences d'agence immobiliere d'un responsable par agent immobilier.
  // url: http://localhost:4040/api/count/agences-immobilieres/agent-immobilier
  countAgencesImmobilieresAgentImmobilier(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/agences-immobilieres/agent-immobilier');
  };
}
