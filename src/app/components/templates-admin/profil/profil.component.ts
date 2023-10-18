import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit{

  user: any;
  affichage = 1;

  erreur: boolean = false;
  personne = this.personneService.personne;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  userForm: any;

  constructor(
    private personneService: PersonneService,
    private messageService: MessageService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.detailUser();
    this.initUserForm()
  }


  initUserForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.userForm = new FormGroup({
      nom: new FormControl(this.personne.nom, [Validators.required]),
      prenom: new FormControl(this.personne.prenom, [Validators.required]),
      username: new FormControl(this.personne.username, [Validators.required]),
      email: new FormControl(this.personne.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl(this.personne.motDePasse, [Validators.required, Validators.maxLength(14), Validators.minLength(7), Validators.pattern(passwordRegex)]),
      telephone: new FormControl(this.personne.telephone, [Validators.required]),
    })
  }

  retour(): void {
    this.userForm.reset();
    this.affichage = 1;
    this.erreur = false;
  }

  get nom(){
    return this.userForm.get('nom');
  }

  get prenom(){
    return this.userForm.get('prenom');
  }

  get username(){
    return this.userForm.get('username');
  }

  get email(){
    return this.userForm.get('email');
  }

  get motDePasse(){
    return this.userForm.get('motDePasse');
  }

  get telephone(){
    return this.userForm.get('telephone');
  }

  afficherFormulaireModifier(): void {
    this.detailUser();
    this.affichage = 2
  }

  detailUser(): void {
    console.log(this.user.id)
    this.personneService.findById(this.user.id).subscribe(
      (response) => {
        this.personne = response;
      }
    );
  }

  modifierUser(): void {
    this.personne.nom = this.userForm.value.nom;
    this.personne.prenom = this.userForm.value.prenom;
    this.personne.username = this.userForm.value.username;
    this.personne.email = this.userForm.value.email;
    this.personne.motDePasse = this.userForm.value.motDePasse;
    this.personne.telephone = this.userForm.value.telephone;
    this.personne.role = this.user.role;

    this.personneService.modifierProfil(this.personne, this.personne.id).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.retour();
          this.messageSuccess = "Votre profil a été modifié avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Mise à jour réussie', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de la modification de vos informations !";
          this.messageService.add({ severity: 'error', summary: 'Erreur de modification', detail: this.messageErreur })
          this.afficherFormulaireModifier();
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Ce nom d'utilisateur a été déjà utilisé!";
        this.messageService.add({ severity: 'warn', summary: 'Mise à jour non réussie', detail: this.messageErreur })
        this.afficherFormulaireModifier();
      }
    })
  }

}
