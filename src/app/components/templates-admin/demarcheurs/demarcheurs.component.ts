import { Component, OnInit } from '@angular/core';
import { Demarcheur } from 'src/app/models/gestionDesComptes/Demarcheur';
import { DemarcheurService } from 'src/app/services/gestionDesComptes/demarcheur.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-demarcheurs',
  templateUrl: './demarcheurs.component.html',
  styleUrls: ['./demarcheurs.component.css']
})
export class DemarcheursComponent implements OnInit{

  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  demarcheur = new Demarcheur();
  demarcheurs : Demarcheur[] = [];
  messageSuccess: string | null = null;

  constructor(
    private demarcheurService: DemarcheurService,
    private personneService: PersonneService
  ) {}

  ngOnInit(): void {
    this.listeDemarcheurs();
  }

  listeDemarcheurs():void{
    this.demarcheurService.getAll().subscribe(
      (response) => {
        this.demarcheurs = response;
      }
    );
  }

  // Récupération des démarcheurs de la page courante
  get demarcheursParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.demarcheurs.slice(startIndex, endIndex);
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
    return Math.ceil(this.demarcheurs.length / this.elementsParPage);
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
    this.listeDemarcheurs();
    this.affichage = 1;
  }

  detailDemarcheur(id: number): void {
    this.demarcheurService.findById(id).subscribe(
      (response) => {
        this.demarcheur = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailDemarcheur(id);
    this.affichage = 2;
  }

  deleteDemarcheur(id: number): void{
    this.demarcheurService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le démarcheur a été supprimé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }

  activerCompte(id: number): void{
    this.personneService.activerCompte(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le compte a été activé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }

  desactiverCompte(id: number): void{
    this.personneService.desactiverCompte(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le compte a été désactivé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }
}
