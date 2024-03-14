import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/interfaces/Page';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { RechercheAvanceePublicationForm } from 'src/app/models/gestionDesPublications/RechercheAvanceePublicationForm';
import { RechercheSimplePublicationForm } from 'src/app/models/gestionDesPublications/RechercheSimplePublicationForm';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-liste-publications',
  templateUrl: './liste-publications.component.html',
  styleUrls: ['./liste-publications.component.css']
})
export class ListePublicationsComponent implements OnInit {

  loading: boolean = false;
  numeroDeLaPage = 0;
  elementsParPage = 8;
  visible: boolean = false;

  affichage = 0;

  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  typesDeBienPourLocation: TypeDeBien[] = [];
  typesDeBienPourVente: TypeDeBien[] = [];

  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  typeDeBienSelectionne = new TypeDeBien();
  rechercheAvanceePublicationForm: RechercheAvanceePublicationForm = new RechercheAvanceePublicationForm();
  rechercheSimplePublicationForm: RechercheSimplePublicationForm = new RechercheSimplePublicationForm();
  typeDeTransactionSelectionne = '';

  publications!: Page<Publication>;
  APIEndpoint: string;

  constructor(private publicationService: PublicationService, private route: ActivatedRoute,
    private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private typeDeBienService: TypeDeBienService,
    private router: Router) {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params['recherche']) {
        sessionStorage.getItem('rechercheSimplePublicationForm') && sessionStorage.removeItem('rechercheSimplePublicationForm');
        sessionStorage.getItem('rechercheAvanceePublicationForm') && sessionStorage.removeItem('rechercheAvanceePublicationForm');
      }
    });

    if (JSON.parse(sessionStorage.getItem('rechercheSimplePublicationForm')!)) {
      this.initRechercheSimple(this.numeroDeLaPage, this.elementsParPage);
    } else if (JSON.parse(sessionStorage.getItem('rechercheAvanceePublicationForm')!)) {
      this.initRechercheAvancee(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.initActivatedRoute(this.numeroDeLaPage, this.elementsParPage);
    }

    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.listeTypesDeBienPourLocation();
    this.listeTypesDeBienPourVente();
  }

  initActivatedRoute(numeroDeLaPage: number, elementsParPage: number): void {
    this.route.queryParams.subscribe(params => {

      this.typeDeTransactionChoisi('Location');

      const libelle = params['libelle'];
      const designation = params['designation'];

      const regions = params['regions'];

      const nomAgence = params['nomAgence'];
      const email = params['email'];

      if (libelle) {
        this.listePublicationsActivesParRegion(libelle, numeroDeLaPage, elementsParPage);
      } else if (designation) {
        this.listePublicationsActivesParTypeDeBien(designation, numeroDeLaPage, elementsParPage);
      } else if (regions) {
        this.listePublicationsActivesParListeRegions(numeroDeLaPage, elementsParPage);
      } else if (nomAgence) {
        this.listePublicationsActivesParAgence(nomAgence, numeroDeLaPage, elementsParPage);
      } else if (email) {
        this.listePublicationsActivesParPersonne(email, numeroDeLaPage, elementsParPage);
      } else {
        this.listePublicationsActives(numeroDeLaPage, elementsParPage);
      }
    });
  }

  initRechercheSimple(numeroDeLaPage: number, elementsParPage: number): void {

    this.rechercheSimplePublicationForm = JSON.parse(sessionStorage.getItem('rechercheSimplePublicationForm')!);
    this.typeDeTransactionChoisi(this.rechercheSimplePublicationForm.typeDeTransaction);
    this.typeDeBienSelectionne = this.rechercheSimplePublicationForm.typeDeBien;
    this.regionSelectionnee = JSON.parse(sessionStorage.getItem('region')!);
    this.villeSelectionnee = JSON.parse(sessionStorage.getItem('ville')!);
    this.quartierSelectionne = this.rechercheSimplePublicationForm.quartier;

    this.rechercheSimpleDePublicationsActives(this.typeDeTransactionSelectionne, this.typeDeBienSelectionne.id,
      this.quartierSelectionne.id, numeroDeLaPage, elementsParPage);
  }

  initRechercheAvancee(numeroDeLaPage: number, elementsParPage: number): void {

    this.rechercheAvanceePublicationForm = JSON.parse(sessionStorage.getItem('rechercheAvanceePublicationForm')!);
    this.typeDeTransactionChoisi(this.rechercheAvanceePublicationForm.typeDeTransaction);
    this.typeDeBienSelectionne = this.rechercheAvanceePublicationForm.typeDeBien;
    this.regionSelectionnee = JSON.parse(sessionStorage.getItem('region')!);
    this.villeSelectionnee = JSON.parse(sessionStorage.getItem('ville')!);
    this.quartierSelectionne = this.rechercheAvanceePublicationForm.quartier;

    this.rechercheAvanceeDePublicationsActives(this.rechercheAvanceePublicationForm, numeroDeLaPage, elementsParPage);
  }

  showDialog() {
      this.visible = true;
  }

  // Liste Publications - Recherche Simple
  rechercheSimpleDePublicationsActives(typeDeTransaction: string, typeDeBienId: number, quartierId: number, numeroDeLaPage: number, elementsParPage: number): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.rechercheSimpleDePublicationsActives(typeDeTransaction, typeDeBienId, quartierId,
      numeroDeLaPage, elementsParPage).subscribe(
        (response) => {
          console.log(response);
          this.publications = response;
          this.loading = false;
        }
      );
    }, 5000);
  }

  // Liste Publications - Recherche Avancée
  rechercheAvanceeDePublicationsActives(r: RechercheAvanceePublicationForm, numeroDeLaPage: number, elementsParPage: number): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.rechercheAvanceeDePublicationsActives(r, numeroDeLaPage, elementsParPage).subscribe(
        (response) => {
          this.publications = response;
          this.loading = false;
        }
      );
    }, 5000);
  }

  // Liste Publications Actives
  listePublicationsActives(numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActives(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives par Région
  listePublicationsActivesParRegion(libelle: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByRegion(libelle, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives - Liste Régions
  listePublicationsActivesParListeRegions(numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByRegionList(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives par Type de Bien
  listePublicationsActivesParTypeDeBien(designation: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByTypeDeBien(designation, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives - Liste Types de Bien
  listePublicationsActivesParListeTypesDeBien(numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByTypeDeBienList(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives par Agence
  listePublicationsActivesParAgence(nomAgence: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByAgence(nomAgence, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  // Liste Publications Actives par Personne
  listePublicationsActivesParPersonne(email: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByPersonne(email, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
      }
    )
  }

  rechercheSimpleDePublication(): void {
    sessionStorage.getItem('rechercheAvanceePublicationForm') && sessionStorage.removeItem('rechercheAvanceePublicationForm');

    sessionStorage.setItem('region', JSON.stringify(this.regionSelectionnee));
    sessionStorage.setItem('ville', JSON.stringify(this.villeSelectionnee));

    this.rechercheSimplePublicationForm.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.rechercheSimplePublicationForm.typeDeBien = this.typeDeBienSelectionne;
    this.rechercheSimplePublicationForm.quartier = this.quartierSelectionne;

    sessionStorage.setItem('rechercheSimplePublicationForm', JSON.stringify(this.rechercheSimplePublicationForm));

    this.router.navigate(['/annonces-immobilieres'], { state: { recherche: 'simple' } });
  }

  rechercheAvanceeDePublication(): void {
    this.visible = false;
    sessionStorage.getItem('rechercheSimplePublicationForm') && sessionStorage.removeItem('rechercheSimplePublicationForm');

    sessionStorage.setItem('region', JSON.stringify(this.regionSelectionnee));
    sessionStorage.setItem('ville', JSON.stringify(this.villeSelectionnee));

    this.rechercheAvanceePublicationForm.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.rechercheAvanceePublicationForm.typeDeBien = this.typeDeBienSelectionne;
    this.rechercheAvanceePublicationForm.quartier = this.quartierSelectionne;

    sessionStorage.setItem('rechercheAvanceePublicationForm', JSON.stringify(this.rechercheAvanceePublicationForm));

    this.router.navigate(['/annonces-immobilieres'], { queryParams: { recherche: 'avancee' } });
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (JSON.parse(sessionStorage.getItem('rechercheSimplePublicationForm')!)) {
      this.initRechercheSimple(this.numeroDeLaPage, this.elementsParPage);
    } else if (JSON.parse(sessionStorage.getItem('rechercheAvanceePublicationForm')!)) {
      this.initRechercheAvancee(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.initActivatedRoute(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  //Fonction pour recupérer la liste des régions actives
  listeRegionsActives(): void {
    this.regionService.getRegionsActives().subscribe(
      (response) => {
        this.regions = response;
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

  typeDeBienChoisi(event: any): void {
    this.typeDeBienSelectionne = event.value;
  }

  typeDeTransactionChoisi(value: string): void {
    this.typeDeTransactionSelectionne = value;
  }

  detailPublicationPage(publication: Publication): void {
    const codePublication = JSON.stringify(publication.codePublication);
    sessionStorage.setItem('codePublication', codePublication);
    this.router.navigate(['/annonce-immobiliere']);
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
