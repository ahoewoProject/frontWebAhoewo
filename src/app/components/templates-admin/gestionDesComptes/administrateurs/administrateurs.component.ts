import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Administrateur } from 'src/app/models/gestionDesComptes/Administrateur';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AdministrateurService } from 'src/app/services/gestionDesComptes/administrateur.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.css']
})
export class AdministrateursComponent implements OnInit {

  affichage = 1;
  visibleAddForm = 0;
  voirMotDePasse: boolean = false;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  admin = this.adminService.administrateur;
  administrateurs : Administrateur[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  adminForm: any;
  roleAdmin: Role = {
    id: 1,
    code: 'ROLE_ADMIN',
    libelle: 'Administrateur',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(
    private adminService: AdministrateurService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeAdmins();
    this.initAdminForm();
  }

  initAdminForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.adminForm = new FormGroup({
      nom: new FormControl(this.admin.nom, [Validators.required]),
      prenom: new FormControl(this.admin.prenom, [Validators.required]),
      email: new FormControl(this.admin.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl(this.admin.telephone, [Validators.required]),
    })
  }

  listeAdmins(): void {
    this.adminService.getAll().subscribe(
      (response) => {
        this.administrateurs = response;
      }
    );
  }

  // Récupération des admins de la page courante
  get administrateursParPage(): any[] {
    return this.administrateurs.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeAdmins()
  }

  voirListe(): void {
    this.listeAdmins();
    this.adminForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.admin = new Administrateur();
  }

  detailAdmin(id: number): void {
    this.adminService.findById(id).subscribe(
      (response) => {
        this.admin = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailAdmin(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
  }

  get nom() {
    return this.adminForm.get('nom');
  }

  get prenom() {
    return this.adminForm.get('prenom');
  }

  get email() {
    return this.adminForm.get('email');
  }

  get telephone() {
    return this.adminForm.get('telephone');
  }

  ajouterAdmin(): void {
    this.admin.role = this.roleAdmin;

    this.adminService.addAdministrateur(this.admin).subscribe(
      (response) => {
        console.log(response);
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "L'administrateur a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de l'administrateur !"
          this.afficherFormulaireAjouter();
          this.admin.nom = response.nom;
          this.admin.prenom = response.prenom;
          this.admin.username = response.username;
          this.admin.email = response.email;
          this.admin.telephone = response.telephone;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Un administrateur avec cette adresse e-mail existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de compte rejetée',
              detail: "Vous avez rejeté l'activation de ce compte !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de compte annulée',
              detail: "Vous avez annulé l'activation de ce compte !"
            });
            break;
        }
      }
    });
  }

  desactiverCompte(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de compte rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn', summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
            });
            break;
        }
      }
    });
  }
}
