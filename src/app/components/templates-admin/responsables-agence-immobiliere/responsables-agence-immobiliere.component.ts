import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';

@Component({
  selector: 'app-responsables-agence-immobiliere',
  templateUrl: './responsables-agence-immobiliere.component.html',
  styleUrls: ['./responsables-agence-immobiliere.component.css']
})
export class ResponsablesAgenceImmobiliereComponent implements OnInit {

  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  responsableAgenceImmobiliere = new ResponsableAgenceImmobiliere();
  responsablesAgenceImmobiliere : ResponsableAgenceImmobiliere[] = [];
  messageSuccess: string | null = null;

  constructor(
    private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeResponsablesAgenceImmobiliere();
  }

  listeResponsablesAgenceImmobiliere(): void {
    this.responsableAgenceImmobiliereService.getAll().subscribe(
      (response) => {
        this.responsablesAgenceImmobiliere = response;
      }
    );
  }

  // Récupération des responsables d'agence immobilière de la page courante
  get responsablesAgenceImmobiliereParPage(): any[] {
    return this.responsablesAgenceImmobiliere.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeResponsablesAgenceImmobiliere()
  }

  voirListe(): void {
    this.listeResponsablesAgenceImmobiliere();
    this.affichage = 1;
  }

  detailResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.responsableAgenceImmobiliere = response;
        console.log(response);
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailResponsableAgenceImmobiliere(id);
    this.affichage = 2;
  }

  supprimerResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le client a été supprimé avec succès.";
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
          console.log(response);
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
