import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-agents-immobiliers',
  templateUrl: './agents-immobiliers.component.html',
  styleUrls: ['./agents-immobiliers.component.css']
})
export class AgentsImmobiliersComponent implements OnInit{

  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  agentImmobilier = new AgentImmobilier();
  agentImmobiliers : AgentImmobilier[] = [];
  messageSuccess: string | null = null;

  constructor(
    private agentImmobilierService: AgentImmobilierService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listeAgentImmobiliers();
  }

  listeAgentImmobiliers():void{
    this.agentImmobilierService.getAll().subscribe(
      (response) => {
        this.agentImmobiliers = response;
      }
    );
  }

  // Récupération des agents immobiliers de la page courante
  get agentsImmobiliersParPage(): any[] {
    return this.agentImmobiliers.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeAgentImmobiliers()
  }

  voirListe(): void{
    this.listeAgentImmobiliers();
    this.affichage = 1;
  }

  detailAgentImmobilier(id: number): void {
    console.log(id)
    this.agentImmobilierService.findById(id).subscribe(
      (response) => {
        this.agentImmobilier = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailAgentImmobilier(id);
    this.affichage = 2;
  }

  deleteAgentImmobilier(id: number): void{
    this.agentImmobilierService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "L'agent immobilier a été supprimé avec succès.";
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
