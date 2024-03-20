import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  profilSelectionne!: Role;
  inscriptionNonReussie: boolean = false;
  registerForm = this.personneService.registerForm;
  message: string = '';

  menus: MenuItem[] | undefined;
  activeIndex: number = 0;

  etape1Form: any;
  etape2Form: any;

  voirMotDePasseConfirmer: boolean = false;

  roles: Role[] = [
    {
      id: 2,
      code: 'ROLE_PROPRIETAIRE',
      libelle: 'Propriétaire',
      creerPar: 0,
      creerLe: new Date(),
      modifierPar: 0,
      modifierLe: new Date(),
      statut: false
    },
    {
      id: 8,
      code: 'ROLE_RESPONSABLE',
      libelle: 'Responsable d\'agence immobilière',
      creerPar: 0,
      creerLe: new Date(),
      modifierPar: 0,
      modifierLe: new Date(),
      statut: false
    },
    {
      id: 4,
      code: 'ROLE_DEMARCHEUR',
      libelle: 'Démarcheur',
      creerPar: 0,
      creerLe: new Date(),
      modifierPar: 0,
      modifierLe: new Date(),
      statut: false
    },
    {
      id: 5,
      code: 'ROLE_CLIENT',
      libelle: 'Client',
      creerPar: 0,
      creerLe: new Date(),
      modifierPar: 0,
      modifierLe: new Date(),
      statut: false
    }
  ]

  roleProprietaire: Role = {
    id: 2,
    code: 'ROLE_PROPRIETAIRE',
    libelle: 'Propriétaire',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  roleRespnsableAgenceImmobiliere: Role = {
    id: 8,
    code: 'ROLE_RESPONSABLE',
    libelle: 'Responsable d\'agence immobilière',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  roleDemarcheur: Role = {
    id: 4,
    code: 'ROLE_DEMARCHEUR',
    libelle: 'Démarcheur',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  roleClient: Role = {
    id: 5,
    code: 'ROLE_CLIENT',
    libelle: 'Client',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  RegisterForm: any;

  constructor(
    private personneService: PersonneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initRegisterMenu();
    this.initEtape1Form();
    this.initEtape2Form();
    this.initRegisterForm();
  }

  initRegisterMenu(): void {
    this.menus = [
      {
          label: 'Informations personnelles',
      },
      {
          label: 'Informations de connexion',
      },
      {
          label: 'Confirmation',
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  initRegisterForm() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.RegisterForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      motDePasseConfirmer: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      telephone: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    }, [ this.passwordMatch("motDePasse", "motDePasseConfirmer") ])
  }

  initEtape1Form() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.etape1Form = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl('', [Validators.required]),
    })
  }

  initEtape2Form() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.etape2Form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      motDePasse: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      motDePasseConfirmer: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      role: new FormControl('', [Validators.required])
    }, [ this.passwordMatch("motDePasse", "motDePasseConfirmer") ])
  }

  get nom() {
    return this.etape1Form.get('nom');
  }

  get prenom() {
    return this.etape1Form.get('prenom');
  }

  get username() {
    return this.etape2Form.get('username');
  }

  get email() {
    return this.etape1Form.get('email');
  }

  get motDePasse() {
    return this.etape2Form.get('motDePasse');
  }

  get motDePasseConfirmer() {
    return this.etape2Form.get('motDePasseConfirmer');
  }

  get telephone() {
    return this.etape1Form.get('telephone');
  }

  get role() {
    return this.etape2Form.get('role');
  }


  profilChoisi(event: any) {
    this.profilSelectionne = event.value;
  }

  etape1(): void {
    this.activeIndex = 0;
  }

  etape2(): void {
    this.activeIndex = 1;
  }

  etape3(): void {
    this.activeIndex = 2;
  }

  register(): void {

    if (this.profilSelectionne.libelle === 'Propriétaire') {
      this.registerProprietaire();
    } else if (this.profilSelectionne.libelle === "Responsable d'agence immobilière") {
      this.registerResponsable();
    } else if (this.profilSelectionne.libelle === "Démarcheur") {
      this.registerDemarcheur();
    } else {
      this.registerClient();
    }
  }

  registerProprietaire(): void {
    this.registerForm.role = this.roleProprietaire;
    this.personneService.inscription(this.registerForm).subscribe(
      (response) => {
        this.RegisterForm.reset();
        this.router.navigate(['/connexion'], { queryParams: { inscriptionSuccess: true } })
      },
      (error) => {
        if (error.error == "Un utilisateur avec ce nom d'utilisateur existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un propriétaire avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        } else if(error.error == "Un utilisateur avec cette adresse e-mail existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un propriétaire avec cette adresse e-mail existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        }
      }
    )
  }

  registerDemarcheur(): void {
    this.registerForm.role = this.roleDemarcheur;
    this.personneService.inscription(this.registerForm).subscribe(
      (response) => {
        this.RegisterForm.reset();
        this.router.navigate(['/connexion'], { queryParams: { inscriptionSuccess: true } })
      },
      (error) => {
        if (error.error == "Un utilisateur avec ce nom d'utilisateur existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un demarcheur avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        } else if (error.error == "Un utilisateur avec cette adresse e-mail existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un demarcheur avec cette adresse e-mail existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        }
      }
    )
  }

  registerResponsable(): void {
    this.registerForm.role = this.roleRespnsableAgenceImmobiliere;
    this.personneService.inscription(this.registerForm).subscribe(
      (response) => {
        this.RegisterForm.reset();
        this.router.navigate(['/connexion'], { queryParams: { inscriptionSuccess: true } })
      },
      (error) => {
        if (error.error == "Un utilisateur avec ce nom d'utilisateur existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un responsable d'agence immobilière avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        } else if (error.error == "Un utilisateur avec cette adresse e-mail existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un responsable d'agence immobilière avec cette adresse e-mail existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        }
      }
    )
  }

  registerClient(): void {
    this.registerForm.role = this.roleClient;
    this.personneService.inscription(this.registerForm).subscribe(
      (response) => {
        this.RegisterForm.reset();
        this.router.navigate(['/connexion'], { queryParams: { inscriptionSuccess: true } })
      },
      (error) => {
        if (error.error == "Un utilisateur avec ce nom d'utilisateur existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un client avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        } else if (error.error == "Un utilisateur avec cette adresse e-mail existe déjà") {
          this.inscriptionNonReussie = true;
          this.message = "Un client avec cette adresse e-mail existe déjà. Veuillez réessayez !";
          this.router.navigate(['/inscription'])
          setTimeout(() => {
            this.inscriptionNonReussie = false;
            this.message = '';
          }, 3000);
        }
      }
    )
  }

  passwordMatch(motDePasse: string, motDePasseConfirmer: string) {
    return function (form: AbstractControl) {
      const passwordValue = form.get(motDePasse)?.value;
      const confirmPasswordValue = form.get(motDePasseConfirmer)?.value;
      if (passwordValue === confirmPasswordValue) {
        return null;
      }
      return { passwordMismatchError: true };
    };
  }

  showPasswordErrors(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (
      (motDePasseErrors?.['minlength'] || motDePasseErrors?.['maxlength'] && motDePasseErrors?.['pattern'] && this.motDePasse?.touched) ||
      (motDePasseConfirmerErrors?.['minlength'] || motDePasseConfirmerErrors?.['maxlength'] && motDePasseConfirmerErrors?.['pattern'] && this.motDePasseConfirmer?.touched)
    );
  }

  showMinLengthError(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (
      (motDePasseErrors?.['minlength'] || motDePasseErrors?.['maxlength'] && this.motDePasse?.touched) ||
      (motDePasseConfirmerErrors?.['minlength'] || motDePasseConfirmerErrors?.['maxlength'] && this.motDePasseConfirmer?.touched)
    );
  }

  showPatternError(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (motDePasseErrors?.['pattern'] || motDePasseConfirmerErrors?.['pattern']);
  }
}
