import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginForm } from 'src/app/models/auth/LoginForm';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  connexionNonReussie: boolean = false;
  erreur: boolean = true;
  user: any;
  message: string = "";
  loginForm: LoginForm = new LoginForm();
  loginData: FormData = new  FormData();

  constructor(private authService: PersonneService,
    private cookieService: CookieService, private router: Router)
    { }

  LoginForm: any;

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void{
    this.LoginForm = new FormGroup({
      username: new FormControl(this.loginForm.username, [Validators.required]),
      password: new FormControl(this.loginForm.password, [Validators.required]),
    })
  }

  get username(){
    return this.LoginForm.get('username');
  }

  get password(){
    return this.LoginForm.get('password');
  }

  login(): void {

    this.loginData.append('username', this.loginForm.username);
    this.loginData.append('password', this.loginForm.password);

    this.authService.login(this.loginData)
      .subscribe(
        response => this.loginSuccess(response),
        error => this.loginError(error)
      );
  }

  private loginSuccess(response: any): void {
    this.LoginForm.reset();
    console.log(response.access_token);

    this.cookieService.set('access_token', response.access_token);
    this.cookieService.set('refresh_token', response.refresh_token);

    this.recupererInfoUser();

  }

  recupererInfoUser(): void {
    this.authService.infoUser()
      .subscribe(
        user => this.userInfo(user),
        error => console.log(error)
      );
  }

  private userInfo(user: any): void {
    console.log(user);
    this.user = user;

    if (this.user.etatCompte === true) {
      this.cookieService.set('user', JSON.stringify(user));
      this.router.navigate(['/admin/dashboard']).then(() => {
        window.location.reload();
      });
    } else {
      this.connexionNonReussie = true;
      this.message = "Votre compte est désactivé. Veuillez contacter l'équipe support technique ahoewo pour obtenir de l'aide supplémentaire";
      this.router.navigate(['/login']);
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
      console.log(this.message);
    }
  }

  private loginError(error: any): void {
    console.log(error);
    this.connexionNonReussie = true;

    if (error.status === 401) {
      this.message = "Username ou mot de passe incorrect. Veuillez réessayer.";
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    } else if (error.status === 404) {
      this.message = "Utilisateur introuvable. Veuillez vérifier vos informations de connexion.";
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    } else {
      this.message = "Erreur lors de la connexion. Veuillez réessayer.";
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    }

    this.router.navigate(['/login']);
  }

}
