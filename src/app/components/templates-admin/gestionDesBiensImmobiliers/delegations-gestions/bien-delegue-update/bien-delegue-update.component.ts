import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-bien-delegue-update',
  templateUrl: './bien-delegue-update.component.html',
  styleUrls: ['./bien-delegue-update.component.css']
})
export class BienDelegueUpdateComponent implements OnInit, OnDestroy {

  menus: MenuItem[] | undefined;
  listeDesCategories: string[] = [];
  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];

  user: any;
  activeIndex: number = 0;
  responsiveOptions: any[] | undefined;

  agencesImmobilieres: AgenceImmobiliere[] = [];
  typesDeBien: TypeDeBien[] = [];
  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  caracteristique: Caracteristiques = new Caracteristiques();
  agenceSelectionnee = new AgenceImmobiliere();
  typeDeBienSelectionne = new TypeDeBien();
  categorieSelectionnee = '';
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  messageErreur: string = "";
  messageSuccess: string | null = null;
  step1Form: any;
  step2Form: any;

  bienImmobilier!: any;
  bienImmAssocie!: any;
  bienImmobilierData: FormData = new FormData();
  images: ImagesBienImmobilier[] = [];

  constructor(private personneService: PersonneService, private paysService: PaysService,
    private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private messageService: MessageService,
    private bienImmAssocieService: BienImmAssocieService, private bienImmobilierService: BienImmobilierService,
    private agenceImmobiliereService: AgenceImmobiliereService, private typeDeBienService: TypeDeBienService,
    private caracteristiqueService: CaracteristiquesService, private router: Router,
    private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
    private imagesBienImmobilierService: ImagesBienImmobilierService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initResponsiveOptions();
    this.menusOfTerrain();

    this.initStep1Form();
    this.initStep2Form();

    this.listeTypesDeBienActifs();
    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.getAgencesImmobilieresListIfUserActif();

    this.initActivatedRoute();
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

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
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
          command: (event: any) => this.messageService.add({severity:'info', summary:'4ème étape', detail: event.item.label})
      },
    ];
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const designation = params.get('designation');

      if (id && designation) {
        this.afficherFormulaireModificationBien(parseInt(id), designation)
      }

    });
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

  initStep1Form(): void {
    this.step1Form = new FormGroup({
      typeDeBien: new FormControl('', [Validators.required]),
      categorie: new FormControl('', [Validators.required]),
      agenceImmobiliere: new FormControl(''),
      matriculeProprietaire: new FormControl(''),
      matriculeBienImmo: new FormControl(''),
      surface: new FormControl(''),
      description: new FormControl(''),
    })
  }

  initStep2Form(): void {
    this.step2Form = new FormGroup({
      pays: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      quartier: new FormControl('', [Validators.required]),
      adresse: new FormControl('')
    })
  }

  get typeDeBien() {
    return this.step1Form.get('typeDeBien');
  }

  get categorie() {
    return this.step1Form.get('categorie');
  }

  get agenceImmobiliere() {
    return this.step1Form.get('agenceImmobiliere');
  }

  get matriculeProprietaire() {
    return this.step1Form.get('matriculeProprietaire');
  }

  get matriculeBienImmo() {
    return this.step1Form.get('matriculeBienImmo');
  }

  get pays() {
    return this.step2Form.get('pays');
  }

  get region() {
    return this.step2Form.get('region');
  }

  get ville() {
    return this.step2Form.get('ville');
  }

  get quartier() {
    return this.step2Form.get('quartier');
  }

  get adresse() {
    return this.step2Form.get('adresse');
  }

  get surface() {
    return this.step1Form.get('surface');
  }

  get description() {
    return this.step1Form.get('description');
  }

  //Fonction pour recupérer la liste des agences immobilieres(Responsable/Agent immobilier)
  getAgencesImmobilieresListIfUserActif(): void {
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee = this.agencesImmobilieres[0];
      }
    );
  }

  //Fonction pour recupérer la liste des types de bien actifs
  listeTypesDeBienActifs(): void {
    this.typeDeBienService.getTypeDeBienActifs().subscribe(
      (response) => {
        this.typesDeBien = response;
        this.typeDeBienSelectionne = this.typesDeBien[0]
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

  isBienAssocie(designation: string): boolean {
    return designation == 'Chambre salon' || designation == 'Chambre'
    || designation == 'Appartement' || designation == 'Boutique'
    || designation == 'Bureau' || designation == 'Magasin'
  }

  isMaisonImmeubleVilla(designation: string): boolean {
    return designation == 'Maison' || designation == 'Immeuble' || designation == 'Villa'
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
      this.listeDesCategories = ['Non meublé','Meublé'];
      this.categorieSelectionnee = this.listeDesCategories[0];
    } else if (this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Chambre salon' || this.typeDeBienSelectionne.designation == 'Villa' || this.typeDeBienSelectionne.designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
      this.categorieSelectionnee = this.listeDesCategories[0];
    }
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

  afficherChampCategorie(designation: string): boolean {
    return designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Bureau' ||
    designation == 'Appartement' || designation == 'Villa' || designation == 'Maison' ||
    designation == 'Immeuble';
  }

  //Fonction pour téléchager les images associés à un bien immobilier
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

  //Fonction pour afficher la deuxième étape d'un formulaire step by step
  afficherFormStep3(designation: string): boolean {
    return designation !== 'Terrain';
  }

  //Fonction pour la non affichage de la deuxième étape d'un formulaire step by step
  nePasAfficherFormStep3(designation: string): boolean {
    return designation == 'Terrain';
  }

  resetFormStep1(): void {
    this.step1Form.reset();
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

  validateUpdateBienForm(): void {
    this.setTypeDeBienValidatorsWithUpdateBienForm();
    // this.setOtherValidatorsBasedOnRole();

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

  private setTypeDeBienValidatorsWithUpdateBienForm(): void {
    this.typeDeBien.setValidators([Validators.required]);
    this.surface.clearValidators();
    this.description.clearValidators();
    this.adresse.clearValidators();
    this.agenceImmobiliere.clearValidators();

    if (this.isTypeDeBienTerrain()) {
      this.categorie.clearValidators();
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
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

  private isTypeDeBienBoutiqueOrMagasin(): boolean {
    return this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin';
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

  //Détails caracteristiques d'un bien
  detailCaracteristiques(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  detailBienImmobilier(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
        this.typeDeBienSelectionne = response.typeDeBien;
        if (this.typeDeBienSelectionne.designation !== 'Terrain') {
          this.detailCaracteristiques(id);
        }
        this.validateUpdateBienForm();
      }
    );
  }

  //Fonction pour afficher les détails d'un bien associé
  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImmAssocie = response;
        this.typeDeBienSelectionne = response.typeDeBien;
        this.detailCaracteristiques(id);
        this.validateUpdateBienForm();
      }
    );
  }

  public isTypeDeBienSupport(designation: string): boolean {
    return designation === 'Terrain' || designation === 'Maison' || designation === 'Villa' || designation === 'Immeuble';
  }

  afficherFormulaireModificationBien(id: number, designation: string): void {
    this.getImagesBienImmobilier(id);
    if (this.isTypeDeBienSupport(designation)) {
      this.detailBienImmobilier(id);
    } else {
      this.detailBienAssocie(id);
    }
    if (designation == 'Immeuble' || designation == 'Appartement' || designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé','Meublé'];
    } else if (designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Villa' || designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    if (designation == 'Terrain') {
      this.menusOfTerrain();
    } else if (designation == 'Maison' || designation == 'Immeuble' || designation == 'Villa') {
      this.menusOfMaisonImmeubleAndVilla();
    } else {
      this.menusOfOtherTypeDeBien();
    }
    this.activeIndex = 0;
    this.validateUpdateBienForm();
  }

  afficherFormulaireModificationBienWithTypeDeBien(designation: string): boolean {
    return designation == 'Terrain' || designation == 'Maison' || designation == 'Immeuble' || designation == 'Villa';
  }

  modifierBien(id: number): void {
    if (this.typeDeBienSelectionne.designation == 'Terrain') {
      this.modifierTypeDeBienTerrain(id);
    } else if (this.typeDeBienSelectionne.designation == 'Maison' || this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Villa') {
      this.modifierOtherTypeDeBien(id);
    } else {
      this.modifierBienImmAssocie(id);
    }
  }

  modifierTypeDeBienTerrain(id: number): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;

    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('images', image);
    }

    this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

    this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
      (response) => {
        console.log(response)
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { modificationReussie: true } });
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.messageErreur = "Erreur lors de la modification du bien !"
          this.afficherFormulaireModificationBien(id, response.typeDeBien.designation);
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
      console.log(error);
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

  modifierOtherTypeDeBien(id: number): void {
    this.bienImmobilier.typeDeBien = this.typeDeBienSelectionne;

    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('images', image);
    }

    this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));
    this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { modificationReussie: true } });
          this.messageSuccess = "Le bien a été modifié avec succès.";
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de la modification du bien !"
          this.afficherFormulaireModificationBien(id, response.typeDeBien.designation);
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
      console.log(error);
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

  modifierBienImmAssocie(id: number): void {

    this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;

    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('images', image);
    }

    this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
    this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.bienImmAssocieService.updateBienImmAssocie(id, this.bienImmobilierData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { modificationReussie: true } });
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmAssocieJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de la modification du bien !"
          this.afficherFormulaireModificationBien(id, response.typeDeBien.designation);
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

  voirListeDelegationsGestions(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions']);
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_ADMINISTRATEUR':
        roleBasedURL = '/admin';
        break;
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable/agences-immobilieres';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
        break;
      case 'ROLE_CLIENT':
        roleBasedURL = '/client';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  ngOnDestroy(): void {

  }

}
