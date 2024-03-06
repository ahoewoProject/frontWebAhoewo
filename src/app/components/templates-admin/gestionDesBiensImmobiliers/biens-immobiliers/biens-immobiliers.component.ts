import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { BienImmobilierAssocie } from 'src/app/models/gestionDesBiensImmobiliers/BienImmAssocie';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { DelegationGestionForm1 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm1';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { BehaviorService } from 'src/app/services/behavior.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-biens-immobiliers',
  templateUrl: './biens-immobiliers.component.html',
  styleUrls: ['./biens-immobiliers.component.css']
})
export class BiensImmobiliersComponent implements OnInit, OnDestroy {

  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;
  menus: MenuItem[] | undefined;
  imagesBienImmobilier: any[] = [];
  responsiveOptions: any[] | undefined;
  agenceSelectionnee = new AgenceImmobiliere();
  bienImmobilierSelectionne = new BienImmobilier();
  typeDeBienSelectionne = new TypeDeBien();
  categorieSelectionnee = '';
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  recherche: string = '';
  affichage = 1;
  user : any;
  imgURLs: any[] = [];
  activeIndex: number = 0;

  elementsParPage = 5;
  numeroDeLaPage = 0;

  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  bienImmAssocie = this.bienImmAssocieService.bienImmobilierAssocie;
  caracteristiqueBien: Caracteristiques = new Caracteristiques();
  caracteristiqueBienAssocie: Caracteristiques = new Caracteristiques();
  agencesImmobilieres: AgenceImmobiliere[] = [];
  biensImmobiliers!: Page<BienImmobilier>;
  biensImmAssocies!: Page<BienImmobilier>;
  images: ImagesBienImmobilier[] = [];
  typesDeBienToStart: TypeDeBien[] = [];
  typesDeBienPourMaison: TypeDeBien[] = [];
  typesDeBienPourImmeuble: TypeDeBien[] = [];
  typesDeBienPourVilla: TypeDeBien[] = [];
  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  bienStep1Form: any;
  bienStep2Form: any;
  bienImmAssocieForm: any;
  delegationGestionForm:  any;
  APIEndpoint: string;
  bienImmobilierData: FormData = new  FormData();
  bienImmAssocieData: FormData = new  FormData();
  delegationGestionForm1 = new DelegationGestionForm1();

  constructor(private caracteristiqueService: CaracteristiquesService,
    private router: Router,
    private typeDeBienService: TypeDeBienService,
    private paysService: PaysService,
    private regionService: RegionService,
    private villeService: VilleService,
    private quartierService: QuartierService,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private imagesBienImmobilierService: ImagesBienImmobilierService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private bienImmobilierService: BienImmobilierService,
    private bienImmAssocieService: BienImmAssocieService,
    private behaviorService: BehaviorService,
    private delegationGestionService: DelegationGestionService
  ) {
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

    this.menusOfTerrain();

    this.initBienStep1Form();
    this.initBienStep2Form();

    this.initDelegationGestionForm();

    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();

    this.listeTypeDeBienToStart();
    this.listeTypeDeBienPourMaison();
    this.listeTypeDeBienPourImmeuble();
    this.listeTypeDeBienPourVilla();

    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeAgencesImmobilieresParResponsable();
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeAgencesImmobilieresParAgent();
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  menusOfTerrain(): void {
    this.menus = [
      {
          label: 'Description',
          command: (event: any) => this.messageService.add({severity:'info', summary:'1ère étape', detail: event.item.label})
      },
      {
          label: 'Localisation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'2ème étape', detail: event.item.label})
      },
      {
          label: 'Confirmation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'3ème étape', detail: event.item.label})
      },
    ];
  }

  menusOfMaisonImmeubleAndVilla(): void {
    this.menus = [
      {
          label: 'Description',
          command: (event: any) => this.messageService.add({severity:'info', summary:'1ère étape', detail: event.item.label})
      },
      {
          label: 'Localisation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'2ème étape', detail: event.item.label})
      },
      {
          label: 'Caractéristiques',
          command: (event: any) => this.messageService.add({severity:'info', summary:'3ème étape', detail: event.item.label})
      },
      {
          label: 'Confirmation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'4ème étape', detail: event.item.label})
      },
    ];
  }

  menusOfOtherTypeDeBien(): void {
    this.menus = [
      {
          label: 'Description',
          command: (event: any) => this.messageService.add({severity:'info', summary:'1ère étape', detail: event.item.label})
      },
      {
          label: 'Caractéristiques',
          command: (event: any) => this.messageService.add({severity:'info', summary:'2ème étape', detail: event.item.label})
      },
      {
          label: 'Confirmation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'3ème étape', detail: event.item.label})
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
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

  //Liste des types de bien to start
  listeTypeDeBienToStart(): void {
    this.typeDeBienService.getTypeDeBienToStart().subscribe(
      (response) => {
        this.typesDeBienToStart = response;
      }
    )
  }

  //Liste des types de bien pour maison
  listeTypeDeBienPourMaison(): void {
    this.typeDeBienService.getTypeDeBienPourMaison().subscribe(
      (response) => {
        this.typesDeBienPourMaison = response;
      }
    );
  }

  //Liste des types de bien pour immeuble
  listeTypeDeBienPourImmeuble(): void {
    this.typeDeBienService.getTypeDeBienPourImmeuble().subscribe(
      (response) => {
        this.typesDeBienPourImmeuble = response;
      }
    );
  }

  //Liste des types de bien pour villa
  listeTypeDeBienPourVilla(): void {
    this.typeDeBienService.getTypeDeBienPourVilla().subscribe(
      (response) => {
        this.typesDeBienPourVilla = response;
      }
    );
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
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
  listeBiensParProprietaire(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensPaginesByProprietaire(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  //Fonction pour recupérer la liste des biens immobiliers des agences d'un responsable
  listeBiensParAgencesResponsable(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensPaginesOfAgencesByResponsable(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  //Fonction pour recupérer la liste des biens immobiliers des agences d'un agent immobilier
  listeBiensParAgencesAgent(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensPaginesOfAgencesByAgent(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  //Fonction pour retourner à la liste des biens immobiliers
  voirListeBiens(): void {
    localStorage.removeItem('idBienImmobilier');
    this.bienImmobilierData.delete('images');
    this.bienImmobilierData.delete('caracteristiquesJson');
    this.bienImmobilierData.delete('bienImmobilierJson');
    this.imagesBienImmobilier = [];
    this.bienStep1Form.reset();
    this.bienStep2Form.reset();
    this.delegationGestionForm.reset();
    this.caracteristiqueBien = new Caracteristiques();
    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
    this.affichage = 1;
  }

  paginationListeBiens(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeBiensParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeBiensParAgencesResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeBiensParAgencesAgent(this.numeroDeLaPage, this.elementsParPage);
    }
  }


  //Détails d'un bien immobilier
  detailBienImmobilier(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
        this.typeDeBienSelectionne = response.typeDeBien;
        if (this.typeDeBienSelectionne.designation !== 'Terrain') {
          this.detailCaracteristiquesBien(id);
        }
      }
    );
  }

  //Détails d'un bien immobilier associé
  detailBienImmAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImmAssocie = response;
        this.typeDeBienSelectionne = response.typeDeBien;
        this.detailCaracteristiquesBienAssocie(id);
      }
    );
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristiqueBien = response;
      }
    );
  }

  //Détails caracteristiques d'un bien associé
  detailCaracteristiquesBienAssocie(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristiqueBienAssocie = response;
      }
    );
  }

  //Fonction pour sélectionner une agence immobiliere
  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  //Fonction pour sélectionner un type de bien
  typeDeBienChoisi(event: any) {
    this.typeDeBienSelectionne = event.value;
    if  (this.typeDeBienSelectionne.designation == 'Terrain') {
      this.menusOfTerrain();
    } else if (this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Villa') {
      this.menusOfMaisonImmeubleAndVilla();
    } else {
      this.menusOfOtherTypeDeBien();
    }

    if (this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé', 'Meublé'];
    } else if (this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Chambre salon' || this.typeDeBienSelectionne.designation == 'Villa' || this.typeDeBienSelectionne.designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    this.validateForm();
  }

  //Fonction pour sélectionner une catégorie pour un type de bien
  categorieChoisie(event: any) {
    this.categorieSelectionnee = event.value;
  }

  //Fonction pour sélectionner un pays
  paysChoisi(event: any) {
    this.paysSelectionne = event.value;
    this.regionService.getRegionsByPaysId(this.paysSelectionne.id).subscribe(
      (response) => {
        this.regions = response;
      }
    );
    this.regionSelectionnee = new Region();
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une région
  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
    this.villeService.getVillesByRegionId(this.regionSelectionnee.id).subscribe(
      (response) => {
        this.villes = response;
      }
    );
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une ville
  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
    this.quartierService.getQuartiersByVilleId(this.villeSelectionnee.id).subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner un quartier
  quartierChoisi(event: any) {
    this.quartierSelectionne = event.value;
  }

  //Fonction pour afficher la page de détails d'un bien immobilier
  afficherPageDetailBienImmobilier(id: number): void {
    this.detailBienImmobilier(id);
    this.getImagesBienImmobilier(id);
    this.affichage = 2;
  }

  //Fonction pour téléchager les images d'un bien immobilier
  async telechargerImagesBienImmobilier(event: any) {
    for (let file of event.files) {
      this.imagesBienImmobilier.push(file);
      await this.readFileAsDataURL(file);
    }
    this.messageSuccess = "Les images ont été téléchargées avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Opération de téléchargement réussie',
      detail: this.messageSuccess
    });
  }

  readFileAsDataURL(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURLs.push(reader.result as string);
        console.log(this.imgURLs);
        resolve();
      };
      reader.onerror = (_event) => {
        reject(reader.error);
      };
    });
  }

  //Fonction pour initialiser le formulaire d'un bien immobilier
  initBienStep1Form(): void {
    this.bienStep1Form = new FormGroup({
      typeDeBien: new FormControl('', [Validators.required]),
      categorie: new FormControl('', [Validators.required]),
      agenceImmobiliere: new FormControl('', [Validators.required]),
      surface: new FormControl(''),
      description: new FormControl(''),
    })
  }

  initBienStep2Form(): void {
    this.bienStep2Form = new FormGroup({
      pays: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      quartier: new FormControl('', [Validators.required]),
      adresse: new FormControl('')
    })
  }

  get typeDeBien() {
    return this.bienStep1Form.get('typeDeBien');
  }

  get categorie() {
    return this.bienStep1Form.get('categorie');
  }

  get agenceImmobiliere() {
    return this.bienStep1Form.get('agenceImmobiliere');
  }

  get surface() {
    return this.bienStep1Form.get('surface');
  }

  get description() {
    return this.bienStep1Form.get('description');
  }

  get pays() {
    return this.bienStep2Form.get('pays');
  }

  get region() {
    return this.bienStep2Form.get('region');
  }

  get ville() {
    return this.bienStep2Form.get('ville');
  }

  get quartier() {
    return this.bienStep2Form.get('quartier');
  }

  get adresse() {
    return this.bienStep2Form.get('adresse');
  }

  //Fonction pour afficher le formulaire d'ajout d'un bien immobilier
  afficherFormulaireAjoutBienImmobilier(): void {
    this.activeIndex = 0;
    this.typeDeBienSelectionne = this.typesDeBienToStart[0];
    this.paysSelectionne = this.listeDesPays[0];
    this.validateForm();
    this.bienImmobilier = new BienImmobilier();
    this.affichage = 3;
  }

  ajouterTypeDeBienTerrain(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
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
          console.log(response)
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.adresse = response.adresse;
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
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    } else {
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
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.adresse = response.adresse;
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
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    }
  }

  ajouterOtherTypeDeBien(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.categorie = this.categorieSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBien));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.adresse = response.adresse;
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
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    } else {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.categorie = this.categorieSelectionnee;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmobilier.pays = this.paysSelectionne;
      this.bienImmobilier.region = this.regionSelectionnee;
      this.bienImmobilier.ville = this.villeSelectionnee;
      this.bienImmobilier.quartier = this.quartierSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBien));

      this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmobilier.adresse = response.adresse;
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
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    }
  }

  //Fonction pour afficher le formulaire de modification d'un bien immobilier
  afficherFormulaireModifierBienImmobilier(id: number, designation: string): void {
    if (designation == 'Immeuble' || designation == 'Appartement' || designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé','Meublé'];
    } else if (designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Villa' || designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    this.affichage = 4;
    this.activeIndex = 0;
    this.detailBienImmobilier(id);
    if (this.bienImmobilier.typeDeBien.designation == 'Terrain') {
      this.menusOfTerrain();
    } else {
      this.menusOfMaisonImmeubleAndVilla();
    }
    this.validateForm();
  }

  modifierTypeDeBienTerrain(id: number): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          console.log(response)
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmobilier.adresse = response.adresse;
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
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      })
    } else {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmobilier.adresse = response.adresse;
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
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      })
    }
  }

  modifierOtherTypeDeBien(id: number): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      // this.bienImmobilier.categorie = this.categorieSelectionnee;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBien));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmobilier.adresse = response.adresse;
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
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      })
    } else {
      this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
      // this.bienImmobilier.categorie = this.categorieSelectionnee;
      this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBien));

      this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiens();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmobilierJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmobilier.adresse = response.adresse;
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
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      })
    }
  }

  afficherChampCategorie(designation: string): boolean {
    return designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Bureau' ||
    designation == 'Appartement' || designation == 'Villa' || designation == 'Maison' ||
    designation == 'Immeuble';
  }

  //Fonction pour afficher la deuxième étape d'un formulaire step by step
  afficherFormStepSuivant(designation: string): boolean {
    return designation !== 'Terrain';
  }

  //Fonction pour la non affichage de la deuxième étape d'un formulaire step by step
  nePasAfficherFormStepSuivant(designation: string): boolean {
    return designation == 'Terrain';
  }

  resetFormStep1(): void {
    this.bienStep1Form.reset();
    this.imagesBienImmobilier = [];
    this.imgURLs = [];
    if (this.affichage == 3) {
      this.affichage = 3;
    } else if (this.affichage == 4) {
      this.affichage = 4;
    }
  }

  etape1(): void {
    this.activeIndex = 0;
    this.onActiveIndexChange(this.activeIndex);
  }

  etape2(): void {
    this.activeIndex = 1;
    this.onActiveIndexChange(this.activeIndex);
  }

  etape3(): void {
    this.activeIndex = 2;
    this.onActiveIndexChange(this.activeIndex);
  }

  etape4(): void {
    this.activeIndex = 3;
    this.onActiveIndexChange(this.activeIndex);
  }

  check(): void {}


  //Fonction pour valider le formulaire d'enregistrement et de modification d'un bien immobilier
  validateForm(): void {
    this.setTypeDeBienValidators();
    this.setOtherValidatorsBasedOnRole();

    this.typeDeBien.updateValueAndValidity();
    this.categorie.updateValueAndValidity();
    this.agenceImmobiliere.updateValueAndValidity();
    this.pays.updateValueAndValidity();
    this.region.updateValueAndValidity();
    this.ville.updateValueAndValidity();
    this.quartier.updateValueAndValidity();
    this.adresse.updateValueAndValidity();
    this.surface.updateValueAndValidity();
    this.description.updateValueAndValidity();
  }

  private setTypeDeBienValidators(): void {
    this.typeDeBien.setValidators([Validators.required]);
    this.surface.clearValidators();
    this.description.clearValidators();
    this.adresse.clearValidators();

    if (this.isTypeDeBienTerrain()) {
      this.categorie.clearValidators();
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
    } else if (this.isTypeDeBienBoutiqueOrMagasin()) {
      this.categorie.clearValidators();
      this.pays.clearValidators();
      this.region.clearValidators();
      this.ville.clearValidators();
      this.quartier.clearValidators();
    } else {
      this.categorie.setValidators([Validators.required]);
      this.pays.clearValidators();
      this.region.clearValidators();
      this.ville.clearValidators();
      this.quartier.clearValidators();
    }
  }

  private isTypeDeBienTerrain(): boolean {
    return this.typeDeBienSelectionne.designation == 'Terrain';
  }

  private isTypeDeBienMaisonImmeubleOrVilla(): boolean {
    return this.typeDeBienSelectionne.designation == 'Maison' ||
    this.typeDeBienSelectionne.designation == 'Immeuble' ||
    this.typeDeBienSelectionne.designation == 'Villa';
  }

  private isTypeDeBienBoutiqueOrMagasin(): boolean {
    return this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin';
  }

  private setOtherValidatorsBasedOnRole(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.agenceImmobiliere.clearValidators();
    } else {
      if (this.isTypeDeBienMaisonImmeubleOrVilla() || this.isTypeDeBienTerrain()) {
        this.agenceImmobiliere.setValidators([Validators.required]);
      } else {
        this.agenceImmobiliere.clearValidators();
      }
    }
  }

  private isUserProprietaireOrDemarcheur(): boolean {
    return this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR';
  }

  listeBiensAssocies(id: number, numeroDeLaPage: number, elementsParPage: number): void {
    this.bienImmAssocieService.getBiensAssociesPaginesByBienImmobilier(id, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmAssocies = response;
      }
    );
  }

  voirListeBiensAssocies(): void {
    const id = JSON.parse(localStorage.getItem('idBienImmobilier')!);
    this.bienImmobilierData.delete('images');
    this.bienImmobilierData.delete('caracteristiquesJson');
    this.bienImmobilierData.delete('bienImmAssocieJson');
    this.imagesBienImmobilier = [];
    this.bienStep1Form.reset();
    this.delegationGestionForm.reset();
    this.caracteristiqueBienAssocie = new Caracteristiques();
    this.listeBiensAssocies(id, this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 5
  }

  paginationListeBiensAssocies(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeBiensAssocies(this.bienImmobilier.id, this.numeroDeLaPage, this.elementsParPage);
  }

  afficherListeBiensAssocies(id: number): void {
    localStorage.setItem('idBienImmobilier', JSON.stringify(id));
    this.detailBienImmobilier(id)
    this.listeBiensAssocies(id, this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 5;
  }

  //Fonction pour afficher la page de détails d'un bien associé
  afficherPageDetailBienImmAssocie(id: number): void {
    this.detailBienImmAssocie(id);
    this.getImagesBienImmobilier(id);
    this.affichage = 6;
  }

  //Fonction pour afficher le formulaire d'ajout d'un bien associé
  afficherFormulaireAjoutBienAssocie(): void {
    this.activeIndex = 0;
    this.validateForm();
    this.bienImmAssocie = new BienImmobilierAssocie();
    this.menusOfOtherTypeDeBien();
    this.affichage = 7;
  }

  //Formulaire d'ajout d'un bien associé
  ajouterBienImmAssocie(): void {

    if (this.isUserProprietaireOrDemarcheur()) {
      this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmAssocie.categorie = this.categorieSelectionnee;
      this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
      this.bienImmAssocie.pays = this.bienImmobilier.pays;
      this.bienImmAssocie.region = this.bienImmobilier.region;
      this.bienImmAssocie.ville = this.bienImmobilier.ville;
      this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
      this.bienImmAssocie.adresse = this.bienImmobilier.adresse;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBienAssocie));

      this.bienImmAssocieService.addBienImmAssocie(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiensAssocies();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmAssocie.surface = response.surface;
            this.bienImmAssocie.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmAssocieJson');
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    } else {
      this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
      this.bienImmAssocie.agenceImmobiliere = this.bienImmobilier.agenceImmobiliere;
      this.bienImmAssocie.categorie = this.categorieSelectionnee;
      this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
      this.bienImmAssocie.pays = this.bienImmobilier.pays;
      this.bienImmAssocie.region = this.bienImmobilier.region;
      this.bienImmAssocie.ville = this.bienImmobilier.ville;
      this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
      this.bienImmAssocie.adresse = this.bienImmobilier.adresse;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBienAssocie));

      this.bienImmAssocieService.addBienImmAssocie(this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiensAssocies();
            this.messageSuccess = "Le bien a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de l'ajout du bien !"
            this.afficherFormulaireAjoutBienImmobilier();
            this.bienImmAssocie.surface = response.surface;
            this.bienImmAssocie.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmAssocieJson');
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      })
    }
  }

  //Fonction pour afficher le formulaire de modification d'un bien associé
  afficherFormulaireModifierBienImmAssocie(id: number, designation: string): void {
    if (designation == 'Appartement' || designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé','meublé'];
    } else if (designation == 'Chambre' || designation == 'Chambre salon') {
      this.listeDesCategories = ['Non meublée', 'meublée'];
    }
    this.affichage = 8;
    this.activeIndex = 0;
    this.detailBienImmAssocie(id);
    this.menusOfOtherTypeDeBien();
    this.validateForm();
  }

  //Formulaire modification d'un bien associé
  modifierBienImmAssocie(id: number): void {

    if (this.isUserProprietaireOrDemarcheur()) {
      this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
      // this.bienImmAssocie.categorie = this.categorieSelectionnee;
      this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
      this.bienImmAssocie.pays = this.bienImmobilier.pays;
      this.bienImmAssocie.region = this.bienImmobilier.region;
      this.bienImmAssocie.ville = this.bienImmobilier.ville;
      this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
      this.bienImmAssocie.adresse = this.bienImmobilier.adresse;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBienAssocie));

      this.bienImmAssocieService.updateBienImmAssocie(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiensAssocies();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmAssocie.surface = response.surface;
            this.bienImmAssocie.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmAssocieJson');
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      })
    } else {
      this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
      // this.bienImmAssocie.categorie = this.categorieSelectionnee;
      this.bienImmAssocie.agenceImmobiliere = this.agenceSelectionnee;
      this.bienImmAssocie.bienImmobilier = this.bienImmobilier;;
      this.bienImmAssocie.pays = this.bienImmobilier.pays;
      this.bienImmAssocie.region = this.bienImmobilier.region;
      this.bienImmAssocie.ville = this.bienImmobilier.ville;
      this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
      this.bienImmAssocie.adresse = this.bienImmobilier.adresse;

      for (const image of this.imagesBienImmobilier) {
        this.bienImmobilierData.append('images', image);
      }

      this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
      this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristiqueBienAssocie));

      this.bienImmAssocieService.updateBienImmAssocie(id, this.bienImmobilierData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.voirListeBiensAssocies();
            this.messageSuccess = "Le bien a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.bienImmobilierData.delete('images');
            this.bienImmobilierData.delete('bienImmAssocieJson');
            this.bienImmobilierData.delete('caracteristiquesJson');
            this.messageErreur = "Erreur lors de la modification du bien !"
            this.afficherFormulaireModifierBienImmobilier(id, response.typeDeBien.designation);
            this.bienImmAssocie.surface = response.surface;
            this.bienImmAssocie.description = response.description;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        this.bienImmobilierData.delete('images');
        this.bienImmobilierData.delete('bienImmAssocieJson');
        this.bienImmobilierData.delete('caracteristiquesJson');
        this.messageErreur = "Une erreur s'est produite lors de modification !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
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
        this.bienImmobilierService.activerBienImmobilier(id).subscribe(
        (response) => {
          if (this.affichage == 1) {
            this.voirListeBiens();
          } else if (this.affichage == 5) {
            this.voirListeBiensAssocies()
          }
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
        this.bienImmobilierService.desactiverBienImmobilier(id).subscribe(
        (response)=> {
          if (this.affichage == 1) {
            this.voirListeBiens();
          } else if (this.affichage == 5) {
            this.voirListeBiensAssocies()
          }
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

  afficherFormulaireDelegationGestionBien(id: number): void {
    this.listeDesChoix = [ 'Gérant', 'Démarcheur', 'Agence immobilière'];
    this.checked = this.listeDesChoix[0];
    this.detailBienImmobilier(id);
    const event = {value: this.checked};
    this.onChoixChange(event);
    this.affichage = 9;
  }

  //Fonction pour savoir sur quel fonction de retour appeler
  callBackListe(designation: string): boolean {
    return designation == 'Terrain' || designation == 'Maison'
    || designation == 'Immeuble' || designation == 'Villa';
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

  annulerDelegationGestion(): void {
    this.delegationGestionForm.reset;
  }

  //Fonction pour ajouter une délégation de gestion
  ajouterDelegationGestion(): void {
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
      // console.log(this.delegationGestionForm1);
      this.delegationGestionService.addDelegationGestionMatricule(this.delegationGestionForm1).subscribe(
        (response) => {
          if (response.id > 0) {
            this.behaviorService.setActiveLink('/proprietaire/delegations-gestions');
            this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
          } else {
            this.messageErreur = "Erreur lors de la délégation de gestion !"
            this.afficherFormulaireDelegationGestionBien(response.bienImmobilier.id);
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        if (error.error == "Ce bien immobilier a été déjà délégué à ce gestionnaire !") {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à ce gestionnaire !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        } else if (error.error == "Ce bien immobilier a été déjà délégué à un gestionnaire !") {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à un gestionnaire !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        } else if (error.error == "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à un gestionnaire !" ) {
          this.messageErreur = "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à un gestionnaire !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        } else {
          this.messageErreur = "La matricule du gestionnaire est introuvable !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail:  this.messageErreur
          });
        }
      })
    } else {
      this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
      this.delegationGestionService.addDelegationGestionCodeAgence(this.delegationGestionForm1).subscribe(
        (response) => {
          if (response.id > 0) {
            this.behaviorService.setActiveLink('/proprietaire/delegations-gestions');
            this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
          } else {
            this.messageErreur = "Erreur lors de la délégation de gestion !"
            this.afficherFormulaireDelegationGestionBien(response.bienImmobilier.id);
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: this.messageErreur
            });
          }
      },
      (error) => {
        if (error.error == "Ce bien immobilier a été déjà délégué à cette agence immobilière !") {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à cette agence immobilière !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail: this.messageErreur
          });
        } else if (error.error == "Ce bien immobilier a été déjà délégué à une agence immobilière !") {
          this.messageErreur = "Ce bien immobilier a été déjà délégué à une agence immobilière !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Délégation de gestion non réussi',
            detail: this.messageErreur
          });
        } else if (error.error == "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à une agence immobilière !") {
          this.messageErreur = "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à une agence immobilière !"
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

  afficherRegion(libelle: string): string {
    if (libelle === 'Maritime') {
        return 'Région Maritime';
    } else if (libelle === 'Plateaux') {
        return 'Région des Plateaux';
    } else if (libelle === 'Centrale') {
        return 'Région Centrale';
    } else if (libelle === 'Kara') {
        return 'Région de la Kara';
    } else if (libelle === 'Savanes') {
        return 'Région des Savanes';
    } else {
        return 'Région inconnue';
    }
  }

  ngOnDestroy(): void {

  }
}
