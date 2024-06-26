import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginForm } from 'src/app/models/auth/LoginForm';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  connexionNonReussie: boolean = false;
  voirMotDePasse: boolean = false;
  user: any;
  message: string = "";
  loginForm: LoginForm = new LoginForm();
  loginData: FormData = new  FormData();
  reinitialisationMotDePasseReussie: any;
  inscriptionReussie: any;
  from: any;
  messageSubscription!: Subscription;

  constructor(
    private personneService: PersonneService, private router: Router,
    private activatedRoute: ActivatedRoute, private messageService: MessageService
  ) {}

  LoginForm: any;

  ngOnInit(): void {
    this.reinitialisationMotDePasseReussie = this.activatedRoute.snapshot.queryParamMap.get('passwordResetSuccess') || '';
    this.inscriptionReussie = this.activatedRoute.snapshot.queryParamMap.get('inscriptionSuccess') || '';
    this.from = this.activatedRoute.snapshot.queryParamMap.get('from') || '';

    if (this.reinitialisationMotDePasseReussie) {
      this.message = 'Mot de passe réinitialisé avec succès !';
      // this.messageService.add({ severity: 'success', summary: 'Réinitialisation de mot réussie', detail: this.message });
      setTimeout(() => {
        this.message = '';
        this.reinitialisationMotDePasseReussie = null
      }, 6000);
    } else if (this.inscriptionReussie) {
      this.message = 'Compte crée avec succès !';
      setTimeout(() => {
        this.message = '';
        this.inscriptionReussie = null
      }, 6000);
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
      this.messageService.add({ severity: 'error', summary: 'Authentification non réussie', detail: this.message });
      this.loginData.delete('username');
      this.loginData.delete('password');
      this.router.navigate(['/connexion']);
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
      //console.log(this.message);
    } else {
      if (this.personneService.estAdmin(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/admin/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estNotaire(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/notaire/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estGerant(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/gerant/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estAgentImmobilier(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/agent-immobilier/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estClient(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/client/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estProprietaire(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/proprietaire/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estResponsable(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/responsable/dashboard'], { queryParams: { connexionReussie: true } })
        }
      } else if (this.personneService.estDemarcheur(this.user.role.code)) {

        this.personneService.enregistrerInfoUser(JSON.stringify(user));

        if (this.from) {
          this.router.navigateByUrl(this.from);
        } else {
          this.router.navigate(['/demarcheur/dashboard'], { queryParams: { connexionReussie: true } })
        }
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
      this.messageService.add({ severity: 'error', summary: 'Authentification non réussie', detail: this.message });
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    } else if (error.status === 404) {
      this.message = "Utilisateur introuvable. Veuillez vérifier vos informations de connexion.";
      this.messageService.add({ severity: 'error', summary: 'Authentification non réussie', detail: this.message });
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    } else {
      this.message = "Erreur lors de la connexion. Veuillez réessayer.";
      this.messageService.add({ severity: 'error', summary: 'Authentification non réussie', detail: this.message });
      setTimeout(() => {
        this.connexionNonReussie = false;
        this.message = '';
      }, 3000);
    }

    this.router.navigate(['/connexion']);
  }

  ngOnDestroy(): void {

  }
}
