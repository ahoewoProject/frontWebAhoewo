import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Confort } from 'src/app/models/gestionDesBiensImmobiliers/Confort';
import { DelegationGestionRequest } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionRequest';
import { Divertissement } from 'src/app/models/gestionDesBiensImmobiliers/Divertissement';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Utilitaire } from 'src/app/models/gestionDesBiensImmobiliers/Utilitaire';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { ConfortService } from 'src/app/services/gestionDesBiensImmobiliers/confort.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { DivertissementService } from 'src/app/services/gestionDesBiensImmobiliers/divertissement.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { UtilitaireService } from 'src/app/services/gestionDesBiensImmobiliers/utilitaire.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-biens-immobiliers',
  templateUrl: './biens-immobiliers.component.html',
  styleUrls: ['./biens-immobiliers.component.css']
})
export class BiensImmobiliersComponent implements OnInit {

  image: any;
  listeDesChoix: any[] | undefined;
  checked: string | undefined;
  menus: MenuItem[] | undefined;
  imagesBienImmobilier: any[] = [];
  responsiveOptions: any[] | undefined;
  agenceSelectionnee = new AgenceImmobiliere();
  typeDeBienSelectionne = new TypeDeBien();
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  confort = new Confort();
  divertissement = new Divertissement();
  utilitaire = new Utilitaire();
  recherche: string = '';
  affichage = 1;
  user : any;
  activeIndex: number = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  delegationGestionRequest = new DelegationGestionRequest();
  agencesImmobilieres: AgenceImmobiliere[] = [];
  biensImmobiliers!: Page<BienImmobilier>;
  images: ImagesBienImmobilier[] = [];
  typesDeBien: TypeDeBien[] = [];
  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  regionsFiltrees: Region[] = [];
  villes: Ville[] = [];
  villesFiltrees: Ville[] = [];
  quartiers: Quartier[] = [];
  quartiersFiltres: Quartier[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  bienImmobilierForm: any;
  delegationGestionForm: any;
  APIEndpoint: string;
  bienImmobilierData: FormData = new  FormData();

  constructor(
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private bienImmobilierService: BienImmobilierService,
    private delegationGestionService: DelegationGestionService,
    private router: Router,
    private typeDeBienService: TypeDeBienService,
    private paysService: PaysService,
    private regionService: RegionService,
    private villeService: VilleService,
    private quartierService: QuartierService,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private imagesBienImmobilierService: ImagesBienImmobilierService,
    private confortService: ConfortService,
    private divertissementService: DivertissementService,
    private utilitaireService: UtilitaireService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
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

    this.menus = [
      {
          label: '1. Description',
          command: (event: any) => this.messageService.add({severity:'info', summary:'1ère étape', detail: event.item.label})
      },
      {
          label: '2. Caractéristiques',
          command: (event: any) => this.messageService.add({severity:'info', summary:'2ème étape', detail: event.item.label})
      }
    ];

    this.initBienImmobilierForm();
    this.initDelegationGestionForm();
    this.listeTypesDeBienActifs();
    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();

    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensImmobiliersParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeAgencesImmobilieresParResponsable();
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeAgencesImmobilieresParAgent();
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  premiereImageDuBien(bienId: any) {
    this.bienImmobilierService.getPremiereImage(bienId).subscribe(
      (response: any) => {
        this.image = response;
      },
      (error) => {
        if (error.status == 404) {
          this.image = null;
        }
      }
    );
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
        ////console.log(error)(error)(response);
      }
    );
  }

  //Fonction pour recupérer la liste des agences immobilieres par agent immobilier
  listeAgencesImmobilieresParAgent(): void {
    this.agenceImmobiliereService.findAgencesByAgent().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Fonction pour recupérer la liste des agences immobilieres par responsable
  listeAgencesImmobilieresParResponsable(): void {
    this.agenceImmobiliereService.findAgencesByResponsable().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Fonction pour recupérer la liste des biens immobiliers par propriétaire
  listeBiensImmobiliersParProprietaire(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getAllByProprietairePagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        //console.log(error)(response);
        this.biensImmobiliers = response;
        this.biensImmobiliers.content.forEach((bien) => {
          this.premiereImageDuBien(bien.id);
        });
      }
    );
  }

  //Fonction pour recupérer la liste des biens immobiliers d'une agence d'un responsable
  listeBiensParAgencesResponsable(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensOfAgencesByResponsablePagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        //console.log(error)(response);
        this.biensImmobiliers = response;
        this.biensImmobiliers.content.forEach((bien) => {
          this.premiereImageDuBien(bien.id);
        });
      }
    );
  }

  //Fonction pour recupérer la liste des biens immobiliers d'une agence d'un agent immobilier
  listeBiensParAgencesAgent(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensOfAgencesByAgentPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        //console.log(error)(response);
        this.biensImmobiliers = response;
        this.biensImmobiliers.content.forEach((bien) => {
          this.premiereImageDuBien(bien.id);
        });
      }
    );
  }

  //Fonction pour recupérer la liste des types de bien actifs
  listeTypesDeBienActifs(): void {
    this.typeDeBienService.getTypeDeBienActifs().subscribe(
      (response) => {
        this.typesDeBien = response;
      }
    );
  }

  //Fonction pour recupérer la liste des pays actifs
  listePaysActifs(): void {
    this.paysService.getPaysActifs().subscribe(
      (response) => {
        this.listeDesPays = response;
      }
    );
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

  //Fonction pour pagination de la page des biens immobiliers
  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensImmobiliersParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  //Fonction pour retourner à la liste des biens immobiliers
  voirListe(): void {
    localStorage.removeItem('bienImmobilier');
    localStorage.removeItem('/proprietaire/delegations-gestions');
    this.imagesBienImmobilier = [];
    this.bienImmobilierForm.reset();
    this.delegationGestionForm.reset();
    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensImmobiliersParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
    this.affichage = 1;
  }

  //Fonction pour afficher les détails d'un bien immobilier
  detailBienImmobilier(id: number): void {
    //console.log(error)(id)
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
        //console.log(error)(this.bienImmobilier)
        if (response.typeDeBien.designation !== 'Terrains') {
          this.detailConfortParBienImmobilier(id);
          this.detailDivertissementParBienImmobilier(id);
          this.detailUtilitaireParBienImmobilier(id);
        }
      }
    );
  }

  detailConfortParBienImmobilier(id: number): void {
    this.confortService.getConfortByBienImmobilier(id).subscribe(
      (response) => {
        this.confort = response;
      }
    );
  }

  detailDivertissementParBienImmobilier(id: number): void {
    this.divertissementService.getDivertissementByBienImmobilier(id).subscribe(
      (response) => {
        this.divertissement = response;
      }
    );
  }

  detailUtilitaireParBienImmobilier(id: number): void {
    this.utilitaireService.getUtilitaireByBienImmobilier(id).subscribe(
      (response) => {
        this.utilitaire = response;
      }
    );
  }

  //Fonction pour afficher la page de détails d'un bien immobilier
  afficherPageDetail(id: number): void {
    this.detailBienImmobilier(id);
    this.getImagesBienImmobilier(id);
    this.affichage = 4;
  }

  //Fonction pour téléchager les images associés à un bien immobilier
  telechargerImagesBienImmobilier(event: any) {
    for(let file of event.files) {
      this.imagesBienImmobilier.push(file);
    }
    //console.log(error)(this.imagesBienImmobilier)
    this.messageSuccess = "Les images du bien immobilier ont été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Téléchargement réussi',
      detail: this.messageSuccess
    });
  }

  //Fonction pour initialiser le formulaire d'ajout d'un bien immobilier
  initBienImmobilierForm(): void {
    this.bienImmobilierForm = new FormGroup({
      typeDeBien: new FormControl('', [Validators.required]),
      agenceImmobiliere: new FormControl('', [Validators.required]),
      pays: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      quartier: new FormControl('', [Validators.required]),
      adresse: new FormControl('', [Validators.required]),
      surface: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl('', [Validators.required]),
    })
  }

  get typeDeBien() {
    return this.bienImmobilierForm.get('typeDeBien');
  }

  get agenceImmobiliere() {
    return this.bienImmobilierForm.get('agenceImmobiliere');
  }

  get pays() {
    return this.bienImmobilierForm.get('pays');
  }

  get region() {
    return this.bienImmobilierForm.get('region');
  }

  get ville() {
    return this.bienImmobilierForm.get('ville');
  }

  get quartier() {
    return this.bienImmobilierForm.get('quartier');
  }

  get adresse() {
    return this.bienImmobilierForm.get('adresse');
  }

  get surface() {
    return this.bienImmobilierForm.get('surface');
  }

  get description() {
    return this.bienImmobilierForm.get('description');
  }

  //Fonction pour sélectionner une agence immobiliere
  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
    //console.log(error)(this.agenceSelectionnee)
  }

  //Fonction pour sélectionner un type de bien
  typeDeBienChoisi(event: any) {
    this.typeDeBienSelectionne = event.value;
    //console.log(error)(this.typeDeBienSelectionne)
  }

  //Fonction pour sélectionner un pays
  paysChoisi(event: any) {
    this.paysSelectionne = event.value;
    //console.log(error)(this.paysSelectionne);
    this.regionsFiltrees = this.regions.filter((region) => region.pays.id == this.paysSelectionne.id);
    this.regionSelectionnee = new Region();
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une région
  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
    //console.log(error)(this.regionSelectionnee)
    this.villesFiltrees = this.villes.filter((ville) => ville.region.id == this.regionSelectionnee.id);
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une ville
  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
    //console.log(error)(this.villeSelectionnee)
    this.quartiersFiltres = this.quartiers.filter((quartier) => quartier.ville.id == this.villeSelectionnee.id);
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner un quartier
  quartierChoisi(event: any) {
    this.quartierSelectionne = event.value;
    //console.log(error)(this.quartierSelectionne)
  }

  //Fonction pour afficher le formulaire d'ajout d'un bien immobilier
  afficherFormulaireAjoutBienImmobilier(): void {
    this.validerFormulaire();
    this.typeDeBienSelectionne = this.typesDeBien[5];
    this.bienImmobilier = new BienImmobilier();
    this.affichage = 2;
  }

  //Fonction pour afficher le formulaire de modification d'un bien immobilier
  afficherFormulaireModifierBienImmobilier(id: number): void {
    this.validerFormulaire();
    this.detailBienImmobilier(id);
    this.affichage = 3;
  }

  //Fonction pour ajouter un bien immobilier
  ajouterBienImmobilier(): void {
    if (this.typeDeBienSelectionne.designation == 'Terrains') {
      this.ajouterBienImmobilierTerrain();
    } else {
      this.ajouterBienImmobilierDifferentDeTerrain();
    }
  }

  ajouterBienImmobilierTerrain(): void {
    if (this.estRoleProprietaireOuDemarcheur()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de l'ajout du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
      })
    } else if (this.estRoleResponsableOuAgentImmo()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Un bien immobilier avec ce nom existe déjà !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
      })
    }
  }

  ajouterBienImmobilierDifferentDeTerrain(): void {

    this.verifierProprietesUtilitaires();
    this.verifierProprietesConforts();
    this.verifierProprietesConforts();

    if (this.estRoleProprietaireOuDemarcheur()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('confortJson', JSON.stringify(this.confort));
      this.bienImmobilierData.append('utilitaireJson', JSON.stringify(this.utilitaire));
      this.bienImmobilierData.append('divertissementJson', JSON.stringify(this.divertissement));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        this.bienImmobilierData.delete('confortJson');
        this.bienImmobilierData.delete('utilitaireJson');
        this.bienImmobilierData.delete('divertissementJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de l'ajout du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
      })
    } else if (this.estRoleResponsableOuAgentImmo()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('confortJson', JSON.stringify(this.confort));
      this.bienImmobilierData.append('utilitaireJson', JSON.stringify(this.utilitaire));
      this.bienImmobilierData.append('divertissementJson', JSON.stringify(this.divertissement));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        this.bienImmobilierData.delete('confortJson');
        this.bienImmobilierData.delete('utilitaireJson');
        this.bienImmobilierData.delete('divertissementJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de l'ajout du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
      })
    }
  }

  //Fonction pour modifier un bien immobilier
  modifierBienImmobilier(id: number): void {
    //console.log(error)(this.bienImmobilier.typeDeBien.designation)
    if (this.bienImmobilier.typeDeBien.designation == 'Terrains') {
      this.modifierBienImmobilier(id);
    } else {
      this.modifierBienImmobilierDifferentDeTerrain(id);
    }
  }

  modifierBienImmobilierTerrain(id: number): void {
    if (this.estRoleProprietaireOuDemarcheur()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de la modification du bien immobilier !"
            this.afficherFormulaireModifierBienImmobilier(this.bienImmobilier.id);
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de la modification du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      })
    } else if (this.estRoleResponsableOuAgentImmo()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de la modification du bien immobilier !"
            this.afficherFormulaireModifierBienImmobilier(this.bienImmobilier.id);
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de la modification du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      })
    }
  }

  modifierBienImmobilierDifferentDeTerrain(id: number): void {

    this.verifierProprietesUtilitaires();
    this.verifierProprietesConforts();
    this.verifierProprietesConforts();

    if (this.estRoleProprietaireOuDemarcheur()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('confortJson', JSON.stringify(this.confort));
      this.bienImmobilierData.append('utilitaireJson', JSON.stringify(this.utilitaire));
      this.bienImmobilierData.append('divertissementJson', JSON.stringify(this.divertissement));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.messageErreur = "Erreur lors de la modification du bien immobilier !"
            this.afficherFormulaireModifierBienImmobilier(this.bienImmobilier.id);
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        this.bienImmobilierData.delete('confortJson');
        this.bienImmobilierData.delete('utilitaireJson');
        this.bienImmobilierData.delete('divertissementJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de la modification du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      })
    } else if (this.estRoleResponsableOuAgentImmo()) {

      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('confortJson', JSON.stringify(this.confort));
      this.bienImmobilierData.append('utilitaireJson', JSON.stringify(this.utilitaire));
      this.bienImmobilierData.append('divertissementJson', JSON.stringify(this.divertissement));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.voirListe();
            this.messageSuccess = "Le bien immobilier a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('confortJson');
            this.bienImmobilierData.delete('utilitaireJson');
            this.bienImmobilierData.delete('divertissementJson');
            this.messageErreur = "Erreur lors de la modification du bien immobilier !"
            this.afficherFormulaireModifierBienImmobilier(this.bienImmobilier.id);
            this.bienImmobilier.typeDeBien = response.typeDeBien;
            this.bienImmobilier.adresse = response.adresse;
            this.bienImmobilier.ville = response.ville;
            this.bienImmobilier.surface = response.surface;
            this.bienImmobilier.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmobilierJson');
        this.bienImmobilierData.delete('confortJson');
        this.bienImmobilierData.delete('utilitaireJson');
        this.bienImmobilierData.delete('divertissementJson');
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Erreur lors de la modification du bien immobilier !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      })
    }
  }

  //Fonction pour activer un bien immobilier
  activerBienImmobilier(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce bien immobilier ?',
      header: "Activation d'un bien immobilier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bienImmobilierService.activerBienImmobilier(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: "Activation du bien immobilier confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Activation du bien immobilier rejetée",
              detail: "Vous avez rejeté l'activation de ce bien immobilier !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Activation du bien immobilier annulée",
              detail: "Vous avez annulé l'activation de ce bien immobilier !"
            });
            break;
        }
      }
    });
  }

  //Fonction pour désactiver un bien immobilier
  desactiverBienImmobilier(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce bien immobilier ?',
      header: "Désactivation d'un bien immobilier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bienImmobilierService.desactiverBienImmobilier(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: "Désactivaction du bien immobilier confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Désactivation du bien immobilier rejetée",
              detail: 'Vous avez rejeté la désactivation de ce bien immobilier !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Désactivation du bien immobilier annulée",
              detail: 'Vous avez annulé la désactivation de ce bien immobilier !'
            });
            break;
        }
      }
    });
  }

  estRoleProprietaireOuDemarcheur(): boolean {
    return (
      this.user.role.code == 'ROLE_PROPRIETAIRE' ||
      this.user.role.code == 'ROLE_DEMARCHEUR'
    );
  }

  estRoleResponsableOuAgentImmo(): boolean {
    return (
      this.user.role.code == 'ROLE_RESPONSABLE' ||
      this.user.role.code == 'ROLE_AGENTIMMOBILIER'
    );
  }

  afficherNombreAppartements(designation: string): boolean {
    return designation == 'Immeubles'
  }

  afficherNombreChambres(designation: string): boolean {
    return designation == 'Immeubles' || designation == 'Appartements' ||
          designation == 'Appartements meublés' || designation == 'Villas' ||
          designation == 'Villas meublées' || designation == 'Maisons'
  }

  afficherNombrePieces(designation: string): boolean {
    return designation == 'Magasins' || designation == 'Immeubles' || designation == 'Bureaux' ||
        designation == 'Bureaux meublés' || designation == 'Villas' ||
        designation == 'Villas meublées' || designation == 'Chambres' ||
        designation == 'Appartements' || designation == 'Appartements meublés' ||
        designation == 'Maisons'
  }

  afficherNombreLits(designation: string): boolean {
    return designation == 'Villas meublées' || designation == 'Appartements meublés'
  }

  afficherNombreSallesDeBains(designation: string): boolean {
    return designation == 'Immeubles' ||  designation == 'Villas' || designation == 'Villas meublées' ||
        designation == 'Maisons' || designation == 'Chambres' || designation == 'Appartements' ||
        designation == 'Appartements meublés'
  }

  afficherNombreFauteuils(designation: string): boolean {
    return designation == 'Appartements meublés' || designation == 'Bureaux meublés'
  }

  afficherNombreGarages(designation: string): boolean {
    return designation == 'Maisons' || designation == 'Villas' ||
          designation == 'Villas meublées' || designation == 'Immeubles'
  }

  ///Fonction pour afficher la deuxième étape d'un formulaire step by step
  afficherFormStep2(designation: string): boolean {
    return designation !== 'Terrains';
  }

  //Fonction pour la non affichage de la deuxième étape d'un formulaire step by step
  nePasAfficherFormStep2(designation: string): boolean {
    return designation == 'Terrains';
  }


  afficherSectionAutresDetails(utilitaire: Utilitaire, confort: Confort): boolean {
    return utilitaire.nombreGarages > 0 ||
           utilitaire.nombreChambres > 0 ||
           utilitaire.nombrePieces > 0 ||
           confort.nombreLits > 0;
  }

  afficherSectionCaracteristiques(utilitaire: Utilitaire, confort: Confort, divertissement: Divertissement): boolean {
    return utilitaire.wifi || utilitaire.laveLinge || utilitaire.cuisine ||
      utilitaire.refrigirateur || utilitaire.toilette || confort.secheCheveux ||
      utilitaire.ferARepasser || utilitaire.espaceDeTravail || utilitaire.eau ||
      utilitaire.electricite || utilitaire.parking || confort.climatisation ||
      confort.chauffage || divertissement.piscine || divertissement.jardin ||
      divertissement.salleDeSport;
  }


  precedent(): void {
    this.activeIndex = 0;
    this.onActiveIndexChange(this.activeIndex);
  }

  suivant(): void {
    this.activeIndex = 1;
    this.onActiveIndexChange(this.activeIndex);
  }

  verifierProprietesUtilitaires(): void {
    if (this.utilitaire.nombreAppartements) {
      this.utilitaire.nombreAppartements
    }

    if (this.utilitaire.nombreChambres) {
      this.utilitaire.nombreChambres
    }

    if (this.utilitaire.nombrePieces) {
      this.utilitaire.nombrePieces
    }

    if (this.utilitaire.nombreSallesDeBains) {
      this.utilitaire.nombreSallesDeBains
    }

    if (this.utilitaire.nombreGarages) {
      this.utilitaire.nombreSallesDeBains
    }

    if (this.utilitaire.wifi) {
      this.utilitaire.wifi
    }

    if (this.utilitaire.laveLinge) {
      this.utilitaire.laveLinge
    }

    if (this.utilitaire.cuisine) {
      this.utilitaire.cuisine
    }

    if (this.utilitaire.refrigirateur) {
      this.utilitaire.refrigirateur
    }

    if (this.utilitaire.eau) {
      this.utilitaire.eau
    }

    if (this.utilitaire.electricite) {
      this.utilitaire.electricite
    }

    if (this.utilitaire.ferARepasser) {
      this.utilitaire.ferARepasser
    }

    if (this.utilitaire.espaceDeTravail) {
      this.utilitaire.espaceDeTravail
    }

    if (this.utilitaire.parking) {
      this.utilitaire.parking
    }
  }

  verifierProprietesConforts(): void {
    if (this.confort.nombreLits) {
      this.confort.nombreLits
    }

    if (this.confort.nombreFauteuils) {
      this.confort.nombreFauteuils
    }

    if (this.confort.chauffage) {
      this.confort.chauffage
    }

    if (this.confort.climatisation) {
      this.confort.climatisation
    }

    if (this.confort.secheCheveux) {
      this.confort.secheCheveux
    }
  }

  verifierProprietesDivertissements(): void {
    if (this.divertissement.television) {
      this.divertissement.television
    }

    if (this.divertissement.piscine) {
      this.divertissement.piscine
    }

    if (this.divertissement.jardin) {
      this.divertissement.jardin
    }

    if (this.divertissement.salleDeSport) {
      this.divertissement.salleDeSport
    }
  }

  //Fonction pour valider le formulaire d'enregistrement et de modification d'un bien immobilier
  validerFormulaire(): void {
    if ((this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR')) {
      this.typeDeBien.setValidators([Validators.required]);
      this.agenceImmobiliere.clearValidators();
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
      this.adresse.setValidators([Validators.required]);
      this.surface.setValidators([Validators.required]);
      this.description.setValidators([Validators.required]);
    } else if ((this.user.role == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER')) {
      this.typeDeBien.setValidators([Validators.required]);
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
      this.adresse.setValidators([Validators.required]);
      this.surface.setValidators([Validators.required]);
      this.description.setValidators([Validators.required]);
    }
    this.typeDeBien.updateValueAndValidity();
    this.agenceImmobiliere.updateValueAndValidity();
    this.pays.updateValueAndValidity();
    this.region.updateValueAndValidity();
    this.ville.updateValueAndValidity();
    this.quartier.updateValueAndValidity();
    this.adresse.updateValueAndValidity();
    this.surface.updateValueAndValidity();
    this.description.updateValueAndValidity();
  }

  check(): void {}

  afficherFormulaireDelegationGestion(bien: BienImmobilier): void {
    this.listeDesChoix = [ 'Gérant', 'Démarcheur', 'Agence immobilière'];
    this.checked = this.listeDesChoix[0];
    localStorage.setItem('bienImmobilier', JSON.stringify(bien));
    localStorage.setItem('activeLink', '/proprietaire/delegations-gestions');
    const event = {value: this.checked};
    this.onChoixChange(event);
    this.affichage = 5;
  }

  //Fonction pour initialiser le formulaire de délégation de gestion d'un bien
  initDelegationGestionForm(): void {
    this.delegationGestionForm = new FormGroup({
      matricule: new FormControl('', [Validators.required]),
      codeAgence: new FormControl('', [Validators.required])
    })
  }

  get matricule() {
    return this.delegationGestionForm.get('matricule')
  }

  get codeAgence() {
    return this.delegationGestionForm.get('codeAgence')
  }

  //Fonction pour changer l'entité à laquelle on délègue la gestion du bien
  onChoixChange(event: any): void {
    this.delegationGestionForm.reset();
    this.checked = event.value;
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.matricule.setValidators([Validators.required]);
      this.codeAgence.clearValidators();
    } else if (this.checked == 'Agence immobilière') {
      this.codeAgence.setValidators([Validators.required]);
      this.matricule.clearValidators();
    }
    this.matricule.updateValueAndValidity();
    this.codeAgence.updateValueAndValidity();
  }

  //Fonction pour ajouter une délégation de gestion
  ajouterDelegationGestion(): void {
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.delegationGestionRequest.bienImmobilier = JSON.parse(localStorage.getItem('bienImmobilier')!);
      this.delegationGestionService.addDelegationGestionMatricule(this.delegationGestionRequest).subscribe(
        (response) => {
          //console.log(error)(response);
          localStorage.removeItem('bienImmobilier');
          if (response.id > 0) {
            this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
          } else {
            this.messageErreur = "Erreur lors de la délégation de gestion !"
            this.afficherFormulaireDelegationGestion(response.bienImmobilier);
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        //console.log(error)(error.status)
        if (error.status == 409) {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à un gestionnaire !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        } else if (error.status == 404 ) {
          this.messageErreur = "La matricule du gestionnaire est introuvable !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        }
      })
    } else {
      this.delegationGestionRequest.bienImmobilier = JSON.parse(localStorage.getItem('bienImmobilier')!);
      this.delegationGestionService.addDelegationGestionCodeAgence(this.delegationGestionRequest).subscribe(
        (response) => {
          //console.log(error)(response);
          localStorage.removeItem('bienImmobilier');
          if (response.id > 0) {
            this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
          } else {
            this.messageErreur = "Erreur lors de la délégation de gestion !"
            this.afficherFormulaireDelegationGestion(response.bienImmobilier);
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à une agence immobilière !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail: this.messageErreur
          });
        } else if (error.status == 404 ) {
          this.messageErreur = "Le code de l'agence immobilière est introuvable !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        }
      })
    }
  }

}
