import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { RechercheAvanceePublicationForm } from 'src/app/models/gestionDesPublications/RechercheAvanceePublicationForm';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  totalePublicationsTypeDeBien: { [key: string]: number } = {};
  totalePublicationsRegion: { [key: string]: number } = {};

  numeroDeLaPage = 0;
  elementsParPage = 3;
  visible: boolean = false;

  publications!: Page<Publication>;
  publicationsDeLocation!: Page<Publication>;
  publicationsDeVente!: Page<Publication>;
  agencesImmobilieres!: Page<AgenceImmobiliere>;
  responsiveOptions: any[] | undefined;
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  typesDeBienPourLocation: TypeDeBien[] = [];
  typesDeBienPourVente: TypeDeBien[] = [];
  typesDeBienActifs: TypeDeBien[] = [];

  rechercheAvanceePublicationForm: RechercheAvanceePublicationForm = new RechercheAvanceePublicationForm();
  rechercheSimplePublicationForm: RechercheAvanceePublicationForm = new RechercheAvanceePublicationForm();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  typeDeBienSelectionne = new TypeDeBien();
  typeDeTransactionSelectionne = '';
  APIEndpoint: string;

  constructor(private agenceImmobiliereService: AgenceImmobiliereService,
    private datePipe: DatePipe, private publicationService: PublicationService,
    private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private typeDeBienService: TypeDeBienService,
    private router: Router) {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.initResponsiveOptions();

    this.typeDeTransactionChoisi('Location');
    this.listeTypesDeBienActifs();

    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.listeTypesDeBienPourLocation();
    this.listeTypesDeBienPourVente();
    this.listePublicationsActives();
    this.listePublicationsDeLocationActives();
    this.listePublicationsDeVenteActives();
    this.listeAgencesImmobilieres();
  }

  initResponsiveOptions(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
    ];
  }

  showDialog() {
    this.visible = true;
  }

  listePublicationsActives(): void {
    this.publicationService.getPublicationsActives(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  listePublicationsDeLocationActives(): void {
    this.publicationService.getPublicationsActivesByLocation(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.publicationsDeLocation = response;
      }
    )
  }

  listePublicationsDeVenteActives(): void {
    this.publicationService.getPublicationsActivesByVente(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.publicationsDeVente = response;
      }
    )
  }

  totalePublicationsParRegion(libelle: string): void {
    this.publicationService.getPublicationsActivesByRegion(libelle, this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.totalePublicationsRegion[libelle] = response.totalElements;
      }
    );
  }

  totalePublicationsParTypeDeBien(designation: string): void {
    this.publicationService.getPublicationsActivesByTypeDeBien(designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.totalePublicationsTypeDeBien[designation] = response.totalElements;
      }
    );
  }

  listeAgencesImmobilieres(): void {
    this.agenceImmobiliereService.getAgencesActives(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    )
  }

  public fermetureOrOuvertureAgence(heureOuverture: string, heureFermeture: string): boolean {
    const now: Date = new Date();
    const formattedHeureOuverture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureOuverture;
    const formattedHeureFermeture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureFermeture;

    const _heureOuverture: Date = new Date(formattedHeureOuverture);
    const _heureFermeture: Date = new Date(formattedHeureFermeture);

    if (now >= _heureOuverture && now <= _heureFermeture) {
      return true;
    } else {
      return false;
    }
  }

  //Fonction pour recupérer la liste des régions actives
  listeRegionsActives(): void {
    this.regionService.getRegionsActives().subscribe(
      (response) => {
        this.regions = response;
        response.forEach(region => {
          this.totalePublicationsParRegion(region.libelle);
        });
      }
    );
  }

  //Fonction pour recupérer la liste des villes actives
  listeVillesActives(): void {
    this.villeService.getVillesActives().subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  //Fonction pour recupérer la liste des quartiers actifs
  listeQuartiersActifs(): void {
    this.quartierService.getQuartiersActifs().subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  //Fonction pour sélectionner une région
  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
    this.villeService.getVillesByRegionId(this.regionSelectionnee.id).subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  //Fonction pour sélectionner une ville
  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
    this.quartierService.getQuartiersByVilleId(this.villeSelectionnee.id).subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  //Fonction pour sélectionner un quartier
  quartierChoisi(event: any) {
    this.quartierSelectionne = event.value;
  }

  listeTypesDeBienPourLocation(): void {
    this.typeDeBienService.getTypeDeBienByLocation().subscribe(
      (response) => {
        this.typesDeBienPourLocation = response;
      }
    )
  }

  listeTypesDeBienPourVente(): void {
    this.typeDeBienService.getTypeDeBienByVente().subscribe(
      (response) => {
        this.typesDeBienPourVente = response;
      }
    )
  }

  listeTypesDeBienActifs(): void {
    this.typeDeBienService.getTypeDeBienActifs().subscribe(
      (response) => {
        this.typesDeBienActifs = response;
        response.forEach(type => {
          this.totalePublicationsParTypeDeBien(type.designation);
        });
      }
    )
  }

  typeDeBienChoisi(event: any): void {
    this.typeDeBienSelectionne = event.value;
  }

  typeDeTransactionChoisi(value: string): void {
    this.typeDeTransactionSelectionne = value;
  }

  afficherAvanceEtCaution(): boolean {
    return this.typeDeTransactionSelectionne == 'Location'
  }

  afficherNombreSalon(): boolean {
    return this.typeDeBienSelectionne.designation == 'Villa'

  }

  afficherNombreChambreSalon(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherNombreChambre(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherNombreBureau(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherNombreMagasin(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherNombreBoutique(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherNombreAppartement(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherNombreCuisine(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherNombreWCDouche(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'

  }

  afficherNombreGarage(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherNombreEtage(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherParking(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherPiscine(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherJardin(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
    || this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherAscenseur(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble'
  }

  afficherToiletteVisiteur(): boolean {
    return this.typeDeBienSelectionne.designation == 'Villa'
  }

  afficherCompteurAdditionnel(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherCashPowerPersonnel(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherWCDoucheInterne(): boolean {
    return this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Boutique'
    || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherWCDoucheExterne(): boolean {
    return this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Appartement'
    || this.typeDeBienSelectionne.designation == 'Chambre salon' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherCuisineInterne(): boolean {
    return this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Appartement'
    || this.typeDeBienSelectionne.designation == 'Chambre salon'
  }

  afficherCuisineExterne(): boolean {
    return this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Appartement'
    || this.typeDeBienSelectionne.designation == 'Chambre salon'
  }

  afficherBalcon(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherTerrasse(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherBaieVitree(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherDalle(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherSolCarelle(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherALEtage(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  afficherPlacard(): boolean {
    return this.typeDeBienSelectionne.designation == 'Chambre'
  }

  afficherGarage(): boolean {
    return this.typeDeBienSelectionne.designation == 'Bureau' || this.typeDeBienSelectionne.designation == 'Chambre'
    || this.typeDeBienSelectionne.designation == 'Chambre salon' || this.typeDeBienSelectionne.designation == 'Appartement'
  }

  afficherPlafonne(): boolean {
    return this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Chambre salon'
    || this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Bureau'
    || this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin'
  }

  isCommissionDisabled(): boolean {
    const prixMin = this.rechercheAvanceePublicationForm.prixMin;
    const prixMax = this.rechercheAvanceePublicationForm.prixMax;

    // Vérifie si les prix minimum et maximum sont compris entre 0 et 100 000 000
    const isInRange = prixMin >= 0 && prixMin <= 100000000 && prixMax >= 0 && prixMax <= 100000000;

    if (isInRange) {
      // Si les prix sont dans la plage spécifiée, fixe la valeur de la commission à 10
      this.rechercheAvanceePublicationForm.commission = 10;
    }

    return isInRange;
  }

  reinitialiser(): void {
    this.rechercheAvanceePublicationForm = new RechercheAvanceePublicationForm();
  }

  rechercheSimpleDePublication(): void {
    sessionStorage.getItem('rechercheAvanceePublicationForm') && sessionStorage.removeItem('rechercheAvanceePublicationForm');

    sessionStorage.setItem('region', JSON.stringify(this.regionSelectionnee));
    sessionStorage.setItem('ville', JSON.stringify(this.villeSelectionnee));

    this.rechercheSimplePublicationForm.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.rechercheSimplePublicationForm.typeDeBien = this.typeDeBienSelectionne;
    this.rechercheSimplePublicationForm.quartier = this.quartierSelectionne;

    sessionStorage.setItem('rechercheSimplePublicationForm', JSON.stringify(this.rechercheSimplePublicationForm));

    this.router.navigate(['/annonces-immobilieres'], { queryParams: { recherche: 'simple' } });
  }

  rechercheAvanceeDePublication(): void {
    sessionStorage.getItem('rechercheSimplePublicationForm') && sessionStorage.removeItem('rechercheSimplePublicationForm');

    sessionStorage.setItem('region', JSON.stringify(this.regionSelectionnee));
    sessionStorage.setItem('ville', JSON.stringify(this.villeSelectionnee));

    this.rechercheAvanceePublicationForm.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.rechercheAvanceePublicationForm.typeDeBien = this.typeDeBienSelectionne;
    this.rechercheAvanceePublicationForm.quartier = this.quartierSelectionne;

    sessionStorage.setItem('rechercheAvanceePublicationForm', JSON.stringify(this.rechercheAvanceePublicationForm));

    this.router.navigate(['/annonces-immobilieres'], { queryParams: { recherche: 'avancee' } });
  }

  formatDate(datePublication: Date): string {
    const now = new Date();
    const publicationDate = new Date(datePublication);
    const diff = now.getTime() - publicationDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 1000 * 60 * 60 * 24) {
      // Aujourd'hui
      return `Aujourd'hui, à ${this.formatTime(publicationDate)}`;
    } else if (diff < 1000 * 60 * 60 * 24 * 2) {
      // Hier
      return `Hier, à ${this.formatTime(publicationDate)}`;
    } else if (diff < 1000 * 60 * 60 * 24 * 3) {
      // Avant-hier
      return `Avant-hier, à ${this.formatTime(publicationDate)}`;
    } else {
      // Autre date
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `le ${publicationDate.getDate()} ${months[publicationDate.getMonth()]} à ${this.formatTime(publicationDate)}`;
    }
  }

  // Fonction pour formater l'heure
  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours} heures ${minutes} minutes`;
  }
}
