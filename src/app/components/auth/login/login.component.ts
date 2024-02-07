import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginForm } from 'src/app/models/auth/LoginForm';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  connexionNonReussie: boolean = false;
  voirMotDePasse: boolean = false;
  user: any;
  message: string = "";
  loginForm: LoginForm = new LoginForm();
  loginData: FormData = new  FormData();
  reinitialisationMotDePasseReussie: any;
  inscriptionReussie: any;

  constructor(
    private personneService: PersonneService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private behaviorService: BehaviorService
  ) {}

  LoginForm: any;

  ngOnInit(): void {
    this.reinitialisationMotDePasseReussie = this.activatedRoute.snapshot.queryParamMap.get('passwordResetSuccess') || '';
    this.inscriptionReussie = this.activatedRoute.snapshot.queryParamMap.get('inscriptionSuccess') || '';
    if (this.reinitialisationMotDePasseReussie) {
      this.message = 'Mot de passe réinitialisé avec succès !';
      setTimeout(() => {
        this.message = '';
        this.reinitialisationMotDePasseReussie = null
      }, 3000);
    } else if (this.inscriptionReussie) {
      this.message = 'Compte crée avec succès !';
      setTimeout(() => {
        this.message = '';
        this.inscriptionReussie = null
      }, 3000);
    }
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.LoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  get username() {
    return this.LoginForm.get('username');
  }

  get password() {
    return this.LoginForm.get('password');
  }

  login(): void {

    //console.log(this.loginForm.username);
    //console.log(this.loginForm.password)

    this.loginData.append('username', this.loginForm.username);
    this.loginData.append('password', this.loginForm.password);

    this.personneService.seConnecter(this.loginData)
      .subscribe(
        response => this.loginSuccess(response),
        error => this.loginError(error)
      );
  }

  private loginSuccess(response: any): void {
    this.LoginForm.reset();
    //console.log(response.refresh_token);

    const access_token = response.access_token;
    const refresh_token = response.refresh_token;

    this.personneService.enregistrerToken(access_token, refresh_token);

    this.recupererInfoUser();

  }

  recupererInfoUser(): void {
    this.personneService.infoUser()
      .subscribe(
        user => this.userInfo(user),
        //error => console.log(error)
      );
  }

  private userInfo(user: any): void {
    //console.log(user);
    this.user = user;

    // if (this.user.etatCompte === true) {
    //   localStorage.setItem('activeLink', '/admin/dashboard');

    //   this.personneService.enregistrerInfoUser(JSON.stringify(user));

    //   this.router.navigate(['/admin/dashboard'], { queryParams: { connexionReussie: true } })
    // } else {
    //   this.connexionNonReussie = true;
    //   this.message = "Votre compte est désactivé. Veuillez contacter l'équipe support technique ahoewo pour obtenir de l'aide supplémentaire.";
    //   this.loginData.delete('username');
    //   this.loginData.delete('password');
    //   this.router.navigate(['/connexion']);
    //   setTimeout(() => {
    //     this.connexionNonReussie = false;
    //     this.message = '';
    //   }, 3000);
    //   console.log(this.message);
    // }
    if (this.user.autorisation === false) {
      this.connexionNonReussie = true;
      this.message = "Vous vous connectez pour la première fois. Veuillez modifier votre mot de passe et vous reconnecter !";
      this.loginData.delete('username');
      this.loginData.delete('password');
      this.router.navigate(['/connexion']);
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
      //console.log(this.message);
    } else {
      if (this.user.role.code === 'ROLE_ADMINISTRATEUR') {
        // localStorage.setItem('activeLink', '/admin/dashboard');
        this.behaviorService.setActiveLink('/admin/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/admin/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_NOTAIRE') {
        // localStorage.setItem('activeLink', '/notaire/dashboard');
        this.behaviorService.setActiveLink('/notaire/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/notaire/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_GERANT') {
        // localStorage.setItem('activeLink', '/gerant/dashboard');
        this.behaviorService.setActiveLink('/gerant/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/gerant/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_AGENTIMMOBILIER') {
        // localStorage.setItem('activeLink', '/agent-immobilier/dashboard');
        this.behaviorService.setActiveLink('/agent-immobilier/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/agent-immobilier/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_CLIENT') {
        // localStorage.setItem('activeLink', '/client/dashboard');
        this.behaviorService.setActiveLink('/client/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/client/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_PROPRIETAIRE') {
        // localStorage.setItem('activeLink', '/proprietaire/dashboard');
        this.behaviorService.setActiveLink('/proprietaire/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/proprietaire/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_RESPONSABLE') {
        // localStorage.setItem('activeLink', '/responsable/dashboard');
        this.behaviorService.setActiveLink('/responsable/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/responsable/dashboard'], { queryParams: { connexionReussie: true } })
      } else if (this.user.role.code === 'ROLE_DEMARCHEUR') {
        // localStorage.setItem('activeLink', '/demarcheur/dashboard');
        this.behaviorService.setActiveLink('/demarcheur/dashboard');

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        this.router.navigate(['/demarcheur/dashboard'], { queryParams: { connexionReussie: true } })
      }

    }
  }

  private loginError(error: any): void {
    //console.log(error);
    this.connexionNonReussie = true;
    this.loginData.delete('username');
    this.loginData.delete('password');

    if (error.status === 401) {
      this.message = "Nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer.";
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

    this.router.navigate(['/connexion']);
  }

}
