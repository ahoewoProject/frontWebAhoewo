import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Notaire } from 'src/app/models/gestionDesComptes/Notaire';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { NotaireService } from 'src/app/services/gestionDesComptes/notaire.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-notaires',
  templateUrl: './notaires.component.html',
  styleUrls: ['./notaires.component.css']
})
export class NotairesComponent implements OnInit{

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  notaire = this.notaireService.notaire;
  notaires!: Page<Notaire>;
  messageErreur: string = "";
  messageSuccess: string | null = null;

  notaireForm: any;

  roleNotaire: Role = {
    id: 6,
    code: 'ROLE_NOTAIRE',
    libelle: 'Notaire',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(
    private notaireService: NotaireService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.listeNotaires(this.numeroDeLaPage, this.elementsParPage);
    this.initNotaireForm()
  }

  initNotaireForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.notaireForm = new FormGroup({
      nom: new FormControl(this.notaire.nom, [Validators.required]),
      prenom: new FormControl(this.notaire.prenom, [Validators.required]),
      email: new FormControl(this.notaire.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl(this.notaire.telephone, [Validators.required]),
    })
  }

  listeNotaires(numeroDeLaPage: number, elementsParPage: number):void{
    this.notaireService.getNotaires(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.notaires = response;
      }
    );
  }


  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeNotaires(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listeNotaires(this.numeroDeLaPage, this.elementsParPage);
    this.notaireForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.notaire = new Notaire();
  }

  detailNotaire(id: number): void {
    this.notaireService.findById(id).subscribe(
      (response) => {
        this.notaire = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailNotaire(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
  }

  get nom() {
    return this.notaireForm.get('nom');
  }

  get prenom() {
    return this.notaireForm.get('prenom');
  }

  get email() {
    return this.notaireForm.get('email');
  }

  get telephone(){
    return this.notaireForm.get('telephone');
  }

  ajouterNotaire(): void {
    this.notaire.role = this.roleNotaire;

    this.notaireService.addNotaire(this.notaire).subscribe(
      (response) => {
        //console.log(response);
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le notaire a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout du notaire !"
          this.afficherFormulaireAjouter();
          this.notaire.nom = response.nom;
          this.notaire.prenom = response.prenom;
          this.notaire.username = response.username;
          this.notaire.email = response.email;
          this.notaire.telephone = response.telephone;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      //console.log(error)
      if(error.status == 409){
        this.messageErreur = "Un notaire avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  supprimerNotaire(id: number): void {
    this.notaireService.deleteById(id).subscribe(
      (response) => {
        //console.log(response);
        this.voirListe();
        this.messageSuccess = "Le notaire a été supprimé avec succès.";
        this.messageService.add({
          severity: 'success',
          summary: 'Suppression réussie',
          detail: this.messageSuccess
        });
      }
    );
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess
          });
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

  desactiverCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
          //console.log(response);
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
              severity: 'warn',
              summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
            });
            break;
        }
      }
    });
  }
}
