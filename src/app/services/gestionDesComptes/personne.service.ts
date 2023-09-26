import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginForm } from 'src/app/models/auth/LoginForm';
import { RegisterForm } from 'src/app/models/auth/RegisterForm';
import { Personne } from 'src/app/models/gestionDesComptes/Personne';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  private isLoggedIn: boolean = false;
  public registerForm: RegisterForm = new RegisterForm();
  public personne: Personne = new Personne();
  url!: string;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService, private router: Router) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Création de compte
  // url: http://localhost:4040/api/register
  register(r: RegisterForm): Observable<any>{
    return this.httpClient.post<RegisterForm>(this.url + 'register', r);
  }

  // Authentification à un compte
  // url: http://localhost:4040/api/login
  login(loginData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'login', loginData);
  }

  // Modifier les informations de son compte
  // url: http://localhost:4040/api/modifier/profil/{id}
  modifierProfil(r: RegisterForm, id: number): Observable<Personne>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.put<Personne>(this.url + 'modifier/profil/'+ id, r, { headers });
  }

  // Recupérer les info de l'utilisateur connecté
  // url: http://localhost:4040/api/user/info
  infoUser(): Observable<Personne> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    console.log(headers)
    this.isLoggedIn = true;
    return this.httpClient.get<Personne>(`${this.url}user/info`, { headers });
  }

  // url: http://localhost:4040/api/activer/compte/{id}
  activerCompte(id: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Personne>(this.url + 'activer/compte/' + id, { headers });
  }

  // url: http://localhost:9000/api/desactiver/compte/{id}
  desactiverCompte(id: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Personne>(this.url + 'desactiver/compte/' + id, { headers });
  }

  // url: http://localhost:9000/api/request-reset-password
  requestResetPassword(emailData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'request-reset-password', emailData);
  }

  // url: http://localhost:9000/api/reset-password
  resetPassword(resetPasswordData: FormData): Observable<any>{
    return this.httpClient.post<any>(this.url + 'reset-password', resetPasswordData);
  }

  // Fonction pour recupérer les nombres d'utilisateurs
  // url: http://localhost:4040/api/count/users
  countUsers(): Observable<any>{
    return this.httpClient.get<any>(this.url + 'count/users');
  };

  // url: http://localhost:4040/api/user/{id}
  findById(id: number): Observable<Personne>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    return this.httpClient.get<Personne>(this.url + 'user/' + id, { headers });
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  // Fonction pour déconnecter un utilisateur
  logout() {
    this.cookieService.delete('access_token');
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }
}
