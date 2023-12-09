import { Component } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Proprietaire } from 'src/app/models/gestionDesComptes/Proprietaire';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ProprietaireService } from 'src/app/services/gestionDesComptes/proprietaire.service';

@Component({
  selector: 'app-proprietaires',
  templateUrl: './proprietaires.component.html',
  styleUrls: ['./proprietaires.component.css']
})
export class ProprietairesComponent {

  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  proprietaire = new Proprietaire();
  proprietaires!: Page<Proprietaire>;
  messageSuccess: string | null = null;

  constructor(
    private proprietaireService: ProprietaireService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeProprietaires(this.numeroDeLaPage, this.elementsParPage);
  }

  listeProprietaires(numeroDeLaPage: number, elementsParPage: number):void {
    this.proprietaireService.getProprietaires(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.proprietaires = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeProprietaires(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void{
    this.listeProprietaires(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  detailProprietaire(id: number): void {
    //console.log(id)
    this.proprietaireService.findById(id).subscribe(
      (response) => {
        this.proprietaire = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailProprietaire(id);
    this.affichage = 2;
  }

  supprimerProprietaire(id: number): void{
    this.proprietaireService.deleteById(id).subscribe(
      (response) => {
        //console.log(response);
        this.voirListe();
        this.messageSuccess = "Le propriétaire a été supprimé avec succès.";
        this.messageService.add({
          severity: 'success',
          summary: 'Suppression réussie',
          detail: this.messageSuccess
        });
      }
    );
  }

  activerCompte(id: number): void{
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

  desactiverCompte(id: number): void{
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
