import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterForm } from 'src/app/models/auth/RegisterForm';
import { Personne } from 'src/app/models/gestionDesComptes/Personne';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  public registerForm: RegisterForm = new RegisterForm();
  public personne: Personne = new Personne();
  url!: string;

  constructor(private httpClient: HttpClient,private router: Router) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Création de compte
  // url: http://localhost:4040/api/register
  inscription(r: RegisterForm): Observable<any>{
    return this.httpClient.post<RegisterForm>(this.url + 'register', r);
  }

  // Authentification à un compte
  // url: http://localhost:4040/api/login
  seConnecter(loginData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'login', loginData);
  }

  // Modifier les informations de son compte
  // url: http://localhost:4040/api/modifier/profil/{id}
  modifierProfil(r: RegisterForm, id: number): Observable<Personne>{
    return this.httpClient.put<Personne>(this.url + 'modifier/profil/'+ id, r);
  }

  // Recupérer les info de l'utilisateur connecté à partir du token d'accès
  // url: http://localhost:4040/api/user/info
  infoUser(): Observable<Personne> {
    return this.httpClient.get<Personne>(`${this.url}user/info`);
  }

  // url: http://localhost:4040/api/activer/compte/{id}
  activerCompte(id: number) {
    return this.httpClient.get<Personne>(this.url + 'activer/compte/' + id);
  }

  // url: http://localhost:9000/api/desactiver/compte/{id}
  desactiverCompte(id: number) {
    return this.httpClient.get<Personne>(this.url + 'desactiver/compte/' + id);
  }

  // url: http://localhost:9000/api/request-reset-password
  requestResetPassword(emailData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'request-reset-password', emailData);
  }

  // url: http://localhost:9000/api/reset-password
  reinitialiserMotDePasse(resetPasswordData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'reset-password', resetPasswordData);
  }

  // Fonction pour recupérer les nombres d'utilisateurs
  // url: http://localhost:4040/api/count/users
  countUsers(): Observable<number>{
    return this.httpClient.get<number>(this.url + 'count/users');
  };

  // url: http://localhost:4040/api/user/{id}
  findById(id: number): Observable<Personne>{
    return this.httpClient.get<Personne>(this.url + 'user/' + id);
  }

  // Fonction pour le rafraîchissement d'un token
  // url: http://localhost:4040/api/refresh-token
  rafraichirToken(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.recupererRefreshToken()}`
    });
    this.effacerToken();
    return this.httpClient.get<any>(this.url + 'refresh-token', { headers });
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  estConnecte(): boolean {
    const access_token = localStorage.getItem('access_token');
    return !! access_token;
  }

  // Fonction pour enregistrer les tokens
  enregistrerToken(access_token: string, refresh_token: string): void {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  // Fonction pour recupérer le token d'accès
  recupererAccessToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  // Fonction pour recupérer le token de rafraîchissement
  recupererRefreshToken(): string {
    return localStorage.getItem('refresh_token') || '';
  }

  // Fonction pour effacer les tokens lors de la déconnexion
  effacerToken(): void {
    localStorage.clear();
  }

  // Fonction pour sauvegarder les informations d'un utilisateur
  // dans un local storage
  enregistrerInfoUser(user: string): void {
    localStorage.setItem('user', user);
  }

  // Fonction pour recupérer les informations de l'utilisateur connecté
  // à partir d'un local storage
  utilisateurConnecte(): string {
    return localStorage.getItem('user') || '';
  }

  // Fonction pour déconnecter un utilisateur
  deconnexion(): void {
    this.effacerToken();
    this.router.navigate(['/connexion']);
  }
}
