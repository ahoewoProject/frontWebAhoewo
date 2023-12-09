import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Client } from 'src/app/models/gestionDesComptes/Client';
import { ClientService } from 'src/app/services/gestionDesComptes/client.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit{

  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  client = new Client();
  clients!: Page<Client>;
  messageSuccess: string | null = null;

  constructor(
    private clientService: ClientService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeClients(this.numeroDeLaPage, this.elementsParPage);
  }

  listeClients(numeroDeLaPage: number, elementsParPage: number): void {
    this.clientService.getClients(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.clients = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows ;
    this.elementsParPage = event.rows;
    this.listeClients(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listeClients(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  detailClient(id: number): void {
    this.clientService.findById(id).subscribe(
      (response) => {
        this.client = response;
        //console.log(response);
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailClient(id);
    this.affichage = 2;
  }

  supprimerClient(id: number): void {
    this.clientService.deleteById(id).subscribe(
      (response) => {
        //console.log(response);
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
