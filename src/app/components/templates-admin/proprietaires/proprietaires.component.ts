import { Component } from '@angular/core';
import { Proprietaire } from 'src/app/models/gestionDesComptes/Proprietaire';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ProprietaireService } from 'src/app/services/gestionDesComptes/proprietaire.service';

@Component({
  selector: 'app-proprietaires',
  templateUrl: './proprietaires.component.html',
  styleUrls: ['./proprietaires.component.css']
})
export class ProprietairesComponent {

  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  proprietaire = new Proprietaire();
  proprietaires : Proprietaire[] = [];
  messageSuccess: string | null = null;

  constructor(
    private proprietaireService: ProprietaireService,
    private personneService: PersonneService
  ) {}

  ngOnInit(): void {
    this.listeProprietaires();
  }

  listeProprietaires():void{
    this.proprietaireService.getAll().subscribe(
      (response) => {
        this.proprietaires = response;
      }
    );
  }

  // Récupération des propriétaires de la page courante
  get proprietairesParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.proprietaires.slice(startIndex, endIndex);
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
    return Math.ceil(this.proprietaires.length / this.elementsParPage);
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
    this.listeProprietaires();
    this.affichage = 1;
  }

  detailProprietaire(id: number): void {
    console.log(id)
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

  deleteProprietaire(id: number): void{
    this.proprietaireService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le propriétaire a été supprimé avec succès.";
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
