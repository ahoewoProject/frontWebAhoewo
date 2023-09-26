import { Component, OnInit } from '@angular/core';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-agents-immobiliers',
  templateUrl: './agents-immobiliers.component.html',
  styleUrls: ['./agents-immobiliers.component.css']
})
export class AgentsImmobiliersComponent implements OnInit{

  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  agentImmobilier = new AgentImmobilier();
  agentImmobiliers : AgentImmobilier[] = [];
  messageSuccess: string | null = null;

  constructor(private agentImmobilierService: AgentImmobilierService,
    private personneService: PersonneService) { }

  ngOnInit(): void {
    this.listeAgentImmobiliers();
  }

  listeAgentImmobiliers():void{
    this.agentImmobilierService.getAll().subscribe(response=>{
      this.agentImmobiliers = response;
    })
  }

  // Récupération des agents immobiliers de la page courante
  get agentsImmobiliersParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.agentImmobiliers.slice(startIndex, endIndex);
  }

  // Fonction pour passer à la page précédente
  pagePrecedente() {
    if (this.pageActuelle > 1) {
      this.pageActuelle--;
    }
  }

  // Fonction pour passer à la page suivante
  pageSuivante() {
    if (this.pageActuelle < this.totalPages) {
      this.pageActuelle++;
    }
  }

  // Calcul du nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.agentImmobiliers.length / this.elementsParPage);
  }

  // Génération du tableau des numéros de page
  get pages(): number[] {
    const totalPagesToShow = 3; // Nombre total de pages à afficher avant d'afficher "..." et la dernière page

    if (this.totalPages <= totalPagesToShow) {
      return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    // Affiche les 3 premières pages
    const firstPages = Array(totalPagesToShow).fill(0).map((x, i) => i + 1);

    // Affiche "..." et la dernière page
    const lastPage = this.totalPages;
    return [...firstPages, -1, lastPage];
  }

  // Fonction pour définir la page actuelle
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
    }
  }

  voirListe(): void{
    this.listeAgentImmobiliers();
    this.affichage = 1;
  }

  detailAgentImmobilier(id: number): void {
    console.log(id)
    this.agentImmobilierService.findById(id).subscribe(response=>{
      this.agentImmobilier = response;
      console.log(response);
    })
  }

  afficherPageDetail(id: number): void {
    this.detailAgentImmobilier(id);
    this.affichage = 2;
  }

  deleteAgentImmobilier(id: number): void{
    this.agentImmobilierService.deleteById(id).subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "L'agent immobilier a été supprimé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }

  activerCompte(id: number): void{
    this.personneService.activerCompte(id).subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le compte a été activé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }

  desactiverCompte(id: number): void{
    this.personneService.desactiverCompte(id).subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le compte a été désactivé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }
}
