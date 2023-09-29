import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  inscriptionNonReussie: boolean = false;
  registerForm = this.authService.registerForm;
  message: string = '';
  selectedRole!: string;

  roleProprietaire: Role = {
    id: 2,
    code: 'ROLE_PROPRIETAIRE',
    libelle: 'Proprietaire',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  roleAgentImmobilier: Role = {
    id: 3,
    code: 'ROLE_AGENTIMMOBILIER',
    libelle: 'Agent immobilier',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  roleDemarcheur: Role = {
    id: 4,
    code: 'ROLE_DEMARCHEUR',
    libelle: 'Demarcheur',
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
    private authService: PersonneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.RegisterForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl('', [Validators.required]),
      telephone: new FormControl('', [Validators.required])
    })
  }

  get nom() {
    return this.RegisterForm.get('nom');
  }

  get prenom() {
    return this.RegisterForm.get('prenom');
  }

  get username() {
    return this.RegisterForm.get('username');
  }

  get email() {
    return this.RegisterForm.get('email');
  }

  get motDePasse() {
    return this.RegisterForm.get('motDePasse');
  }

  get telephone() {
    return this.RegisterForm.get('telephone');
  }

  get role() {
    return this.RegisterForm.get('role');
  }

  register(): void {

    if (this.selectedRole === 'Proprietaire') {
      this.registerForm.role = this.roleProprietaire;
      console.log(this.registerForm)
      this.authService.register(this.registerForm).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/login'])
        },
        (error) => {
          console.log(error)
          if(error.status === 409){
            this.inscriptionNonReussie = true;
            this.message = "Un propriétaire avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
            this.router.navigate(['/register'])
            setTimeout(() => {
              this.inscriptionNonReussie = false;
              this.message = '';
            }, 3000);
          }
        }
      )
    } else if (this.selectedRole === "Agent immobilier") {
      this.registerForm.role = this.roleAgentImmobilier;
      this.authService.register(this.registerForm).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/login'])
        },
        (error) => {
          console.log(error)
          if(error.status === 409){
            this.inscriptionNonReussie = true;
            this.message = "Un agent immobilier avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
            this.router.navigate(['/register'])
            setTimeout(() => {
              this.inscriptionNonReussie = false;
              this.message = '';
            }, 3000);
          }
        }
      )
    }else if(this.selectedRole === "Demarcheur"){
      this.registerForm.role = this.roleDemarcheur;
      this.authService.register(this.registerForm).subscribe(
        (response) =>{
          console.log(response);
          this.router.navigate(['/login'])
        },
        (error) =>{
          if(error.status === 409){
            this.inscriptionNonReussie = true;
            this.message = "Un démarheur avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
            this.router.navigate(['/register'])
            setTimeout(() => {
              this.inscriptionNonReussie = false;
              this.message = '';
            }, 3000);
          }
        }
      )
    }else{
      this.registerForm.role = this.roleClient;
      this.authService.register(this.registerForm).subscribe(
        (response) =>{
          console.log(response);
          this.router.navigate(['/login'])
        },
        (error) =>{
          console.log(error)
          if(error.status === 409){
            this.inscriptionNonReussie = true;
            this.message = "Un client avec ce nom d'utilisateur existe déjà. Veuillez réessayez !";
            this.router.navigate(['/register'])
            setTimeout(() => {
              this.inscriptionNonReussie = false;
              this.message = '';
            }, 3000);
          }
        }
      )
    }
  }
}
