import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Client } from 'src/app/models/gestionDesComptes/Client';
import { ClientService } from 'src/app/services/gestionDesComptes/client.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit{

  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  client = new Client();
  clients : Client[] = [];
  messageSuccess: string | null = null;

  constructor(
    private clientService: ClientService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeClients();
  }

  listeClients():void{
    this.clientService.getAll().subscribe(
      (response) => {
        this.clients = response;
      }
    );
  }

  // Récupération des clients de la page courante
  get clientsParPage(): any[] {
    return this.clients.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeClients()
  }

  voirListe(): void{
    this.listeClients();
    this.affichage = 1;
  }

  detailClient(id: number): void {
    this.clientService.findById(id).subscribe(
      (response) => {
        this.client = response;
        console.log(response);
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailClient(id);
    this.affichage = 2;
  }

  deleteDemarcheur(id: number): void{
    this.clientService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le client a été supprimé avec succès.";
        this.messageService.add({ severity: 'success', summary: 'Suppression réussie', detail: this.messageSuccess })
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
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({ severity: 'success', summary: 'Activation de compte confirmé', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Activation de compte rejetée', detail: "Vous avez rejeté l'activation de ce compte !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Activation de compte annulée', detail: "Vous avez annulé l'activation de ce compte !" });
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
          this.messageService.add({ severity: 'success', summary: 'Désactivaction de compte confirmé', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Désactivation de compte rejetée', detail: 'Vous avez rejeté la désactivation de ce compte !' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Désactivation de compte annulée', detail: 'Vous avez annulé la désactivation de ce compte !' });
            break;
        }
      }
    });
  }
}
