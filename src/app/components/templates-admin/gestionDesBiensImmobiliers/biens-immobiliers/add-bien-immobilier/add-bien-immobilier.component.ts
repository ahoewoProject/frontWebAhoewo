import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
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
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-bien-immobilier',
  templateUrl: './add-bien-immobilier.component.html',
  styleUrls: ['./add-bien-immobilier.component.css']
})
export class AddBienImmobilierComponent implements OnInit, OnDestroy {

  activeIndex: number = 0;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  typeDeTransactionSelectionne!: string;
  agenceSelectionnee = new AgenceImmobiliere();
  bienImmobilierSelectionne = new BienImmobilier();
  typeDeBienSelectionne = new TypeDeBien();
  categorieSelectionnee = '';
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  caracteristiqueBien: Caracteristiques = new Caracteristiques();


  bienImmobilierData: FormData = new  FormData();

  agencesImmobilieres: AgenceImmobiliere[] = [];
  images: ImagesBienImmobilier[] = [];
  typesDeBienToStart: TypeDeBien[] = [];
  typesDeBienPourMaison: TypeDeBien[] = [];
  typesDeBienPourImmeuble: TypeDeBien[] = [];
  typesDeBienPourVilla: TypeDeBien[] = [];
  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];

  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];

  bienStep1Form: any;
  bienStep2Form: any;

  responsiveOptions: any[] | undefined;
  menus: MenuItem[] | undefined;
  user: any;
  APIEndpoint: string;

  constructor(private personneService: PersonneService, private messageService: MessageService,
    private paysService: PaysService, private regionService: RegionService,
    private villeService: VilleService, private quartierService: QuartierService,
    private typeDeBienService: TypeDeBienService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private agenceImmobiliereService: AgenceImmobiliereService, private bienImmobilierService: BienImmobilierService,
    private confirmationService: ConfirmationService, private router: Router, private activatedRoute: ActivatedRoute,
    private caracteristiqueService: CaracteristiquesService, private publicationService: PublicationService,
    private delegationGestionService: DelegationGestionService, private sanitizer: DomSanitizer
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.activeIndex = 0;
    this.initResponsiveOptions();

    this.menusOfTerrain();

    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();

    this.listeTypeDeBienToStart();
    this.listeTypeDeBienPourMaison();
    this.listeTypeDeBienPourImmeuble();
    this.listeTypeDeBienPourVilla();

    this.getAgencesImmobilieresListIfUserActif();

    this.initBienStep1Form();
    this.initBienStep2Form();
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

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  //Fonction pour recupérer la liste des pays actifs
  listePaysActifs(): void {
    this.paysService.getPaysActifs().subscribe(
      (response) => {
        this.listeDesPays = response;
        this.paysSelectionne = this.listeDesPays[0];
      }
    );
  }

  afficherListeBiens(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports']);
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
        this.typeDeBienSelectionne = this.typesDeBienToStart[0];
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
        for (let image of this.images) {
          this.loadImage(image.id)
        }
      }
    );
  }

  loadImage(id: number): void {
    this.imagesBienImmobilierService.getImage(id).subscribe(imageBlob => {
      const objectURL = URL.createObjectURL(imageBlob);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.imgURLs.push(safeUrl);
    });
  }

  //Fonction pour recupérer la liste des agences immobilieres(Responsable/Agent immobilier)
  getAgencesImmobilieresListIfUserActif(): void {
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee =  this.agencesImmobilieres[0];
      }
    );
  }

  //Fonction pour retourner à la liste des biens immobiliers
  voirListeBiens(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports']);
  }

  //Fonction pour sélectionner une agence immobiliere
  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  //Fonction pour sélectionner un type de bien
  typeDeBienChoisi(event: any) {
    this.typeDeBienSelectionne = event.value;
    if (this.typeDeBienSelectionne.designation == 'Terrain') {
      this.menusOfTerrain();
    } else if (this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Villa') {
      this.menusOfMaisonImmeubleAndVilla();
    }

    if (this.typeDeBienSelectionne.designation == 'Immeuble') {
      this.listeDesCategories = ['Non meublé', 'Meublé'];
    } else if (this.typeDeBienSelectionne.designation == 'Villa' || this.typeDeBienSelectionne.designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    this.validerFormulaireBienImmobilier();
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
        resolve();
      };
      reader.onerror = (_event) => {
        reject(reader.error);
      };
    });
  }

  async deleteFile(imageBienImmobilier: any) {
    const index = this.imagesBienImmobilier.findIndex(image => image === imageBienImmobilier);
    if (index !== -1) {
      this.imagesBienImmobilier.splice(index, 1);
    }
  }

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

  //Fonction/ Ajout - Terrain
  ajouterTypeDeBienTerrain(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.ajouterTypeDeBienTerrainIfUserIsProprietaireOrDemarcheur();
    } else {
      this.ajouterTypeDeBienTerrainIfUserIsNotProprietaireOrDemarcheur();
    }
  }

  //Fonction/ Ajout - Terrain/ Utilisateur Propriétaire - Démarcheur
  ajouterTypeDeBienTerrainIfUserIsProprietaireOrDemarcheur(): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmobilier.quartier = this.quartierSelectionne;
    this.bienImmobilier.personne = this.user;
    this.bienImmobilier.estDelegue = false;

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
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports'], { queryParams: { ajoutReussi: true}});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
      console.log(error);
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

  //Fonction/ Ajout - Terrain/ Utilisateur Responsable - Agent Immobilier
  ajouterTypeDeBienTerrainIfUserIsNotProprietaireOrDemarcheur(): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
    this.bienImmobilier.quartier = this.quartierSelectionne;
    this.bienImmobilier.estDelegue = false;

    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('images', image);
    }

    this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

    this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports'], { queryParams: { ajoutReussi: true}});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
      console.log(error)
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

  //Fonction/ Ajout Villa-Immeuble-Maison
  ajouterOtherTypeDeBien(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.ajouterOtherTypeDeBienIfUserIsProprietaireOrDemarcheur();
    } else {
      this.ajouterOtherTypeDeBienIfUserIsNotProprietaireOrDemarcheur();
    }
  }

  //Fonction/ Ajout Villa-Immeuble-Maison/ Utilisateur Propriétaire-Démarcheur
  ajouterOtherTypeDeBienIfUserIsProprietaireOrDemarcheur(): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmobilier.categorie = this.categorieSelectionnee;
    this.bienImmobilier.quartier = this.quartierSelectionne;
    this.bienImmobilier.personne = this.user;
    this.bienImmobilier.estDelegue = false;

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
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports'], { queryParams: { ajoutReussi: true}});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
      console.log(error)
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

  //Fonction/ Ajout Villa-Immeuble-Maison/ Utilisateur Responsable - AgentImmobilier
  ajouterOtherTypeDeBienIfUserIsNotProprietaireOrDemarcheur(): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmobilier.categorie = this.categorieSelectionnee;
    this.bienImmobilier.agenceImmobiliere = this.agenceSelectionnee;
    this.bienImmobilier.quartier = this.quartierSelectionne;
    this.bienImmobilier.estDelegue = false;

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
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports'], { queryParams: { ajoutReussi: true}});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
      console.log(error)
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

  validerFormulaireBienImmobilier(): void {
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
    } else if (this.isTypeDeBienMaisonImmeubleOrVilla()) {
      this.categorie.setValidators([Validators.required]);
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
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
    return this.personneService.estProprietaire(this.user.role.code) || this.personneService.estDemarcheur(this.user.role.code);
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable/agences-immobilieres';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  ngOnDestroy(): void {

  }
}
