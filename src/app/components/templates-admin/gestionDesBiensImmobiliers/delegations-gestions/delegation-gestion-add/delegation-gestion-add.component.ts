import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { DelegationGestionForm2 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm2';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-delegation-gestion-add',
  templateUrl: './delegation-gestion-add.component.html',
  styleUrls: ['./delegation-gestion-add.component.css']
})
export class DelegationGestionAddComponent implements OnInit, OnDestroy {

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
  activeIndex: number = 0;

  checked: string | undefined;
  responsiveOptions: any[] | undefined;
  menus: MenuItem[] | undefined;
  listeDesCategories: string[] = [];
  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];
  user: any;
  delegationGestionForm2: DelegationGestionForm2 = new DelegationGestionForm2();
  delegationGestionData: FormData = new FormData();

  constructor(private paysService: PaysService, private regionService: RegionService,
    private villeService: VilleService, private quartierService: QuartierService,
    private personneService: PersonneService, private messageService: MessageService,
    private agenceImmobiliereService: AgenceImmobiliereService, private typeDeBienService: TypeDeBienService,
    private delegationGestionService: DelegationGestionService, private router: Router
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

    this.initActivateRoute();
  }

  initActivateRoute(): void {
    this.afficherFormulaireEnregistrerDelegation();
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

  //Fonction pour afficher le formulaire déléguer un bien
  afficherFormulaireEnregistrerDelegation(): void {
    this.activeIndex = 0;
    this.caracteristique = new Caracteristiques();
    this.validateDelegationGestionForm();
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
    this.validateDelegationGestionForm();
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

  validateDelegationGestionForm(): void {
    this.setTypeDeBienValidators();
    this.setOtherValidatorsBasedOnRole();

    this.typeDeBien.updateValueAndValidity();
    this.categorie.updateValueAndValidity();
    this.matriculeProprietaire.updateValueAndValidity();
    this.matriculeBienImmo.updateValueAndValidity();
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

    if (this.isTypeDeBienMaisonImmeubleOrVilla()) {
      this.categorie.setValidators([Validators.required]);
      this.matriculeProprietaire.setValidators([Validators.required]);
      this.matriculeBienImmo.clearValidators();
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
    } else if (this.isTypeDeBienTerrain()) {
      this.categorie.clearValidators();
      this.matriculeProprietaire.setValidators([Validators.required]);
      this.matriculeBienImmo.clearValidators();
      this.pays.setValidators([Validators.required]);
      this.region.setValidators([Validators.required]);
      this.ville.setValidators([Validators.required]);
      this.quartier.setValidators([Validators.required]);
    } else if (this.isTypeDeBienBoutiqueOrMagasin()) {
      this.categorie.clearValidators();
      this.matriculeProprietaire.clearValidators();
      this.matriculeBienImmo.setValidators([Validators.required]);
      this.pays.clearValidators();
      this.region.clearValidators();
      this.ville.clearValidators();
      this.quartier.clearValidators();
    } else {
      this.categorie.setValidators([Validators.required]);
      this.matriculeProprietaire.clearValidators();
      this.matriculeBienImmo.setValidators([Validators.required]);
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
    if (this.isUserDemarcheurOrGerant()) {
      this.agenceImmobiliere.clearValidators();
    } else {
      if (this.isTypeDeBienMaisonImmeubleOrVilla() || this.isTypeDeBienTerrain()) {
        this.agenceImmobiliere.setValidators([Validators.required]);
      } else {
        this.agenceImmobiliere.clearValidators();
      }
    }
  }

  private isUserDemarcheurOrGerant(): boolean {
    return this.user.role.code == 'ROLE_DEMARCHEUR' || this.user.role.code == 'ROLE_GERANT';
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

  enregistrerDelegationGestion(): void {
    if (this.typeDeBienSelectionne.designation == 'Terrain' || this.typeDeBienSelectionne.designation == 'Maison' ||
      this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Villa') {
      this.deleguerNotBienAssocie();
    } else {
      this.deleguerBienAssocie();
    }
  }

  deleguerNotBienAssocie(): void {
    if (this.isUserDemarcheurOrGerant()) {
      this.deleguerNotBienAssocieIfUserDemarcheurOrGerant();
    } else {
      this.deleguerNotBienAssocieIfUserNotDemarcheurOrGerant();
    }
  }

  deleguerNotBienAssocieIfUserDemarcheurOrGerant(): void {
    this.delegationGestionForm2.typeDeBien = this.typeDeBienSelectionne;
    this.delegationGestionForm2.categorie = this.categorieSelectionnee;
    this.delegationGestionForm2.quartier = this.quartierSelectionne;

    for (const image of this.imagesBienImmobilier) {
      this.delegationGestionData.append('images', image);
    }

    this.delegationGestionData.append('delegationGestionJson', JSON.stringify(this.delegationGestionForm2));
    this.delegationGestionData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.delegationGestionService.enregistrerDelegationGestion(this.delegationGestionData).subscribe(
      (response) => {
        console.log(response)
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { delegationReussie: true } });
        } else {
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'enregistrement !"
          this.afficherFormulaireEnregistrerDelegation();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      this.delegationGestionData.delete('images');
      this.delegationGestionData.delete('delegationGestionJson');
      this.delegationGestionData.delete('caracteristiquesJson');
      if (error.error === "La matricule du propriétaire est introuvable !") {
        this.messageErreur = "La matricule du propriétaire est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      } else if (error.error === "Le code de l'immeuble ou de la maison est introuvable !") {
        this.messageErreur = "Le code de l'immeuble ou de la maison est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
    })
  }

  deleguerNotBienAssocieIfUserNotDemarcheurOrGerant(): void {
    this.delegationGestionForm2.typeDeBien = this.typeDeBienSelectionne;
    this.delegationGestionForm2.categorie = this.categorieSelectionnee;
    this.delegationGestionForm2.agenceImmobiliere = this.agenceSelectionnee;
    this.delegationGestionForm2.quartier = this.quartierSelectionne;

    for (const image of this.imagesBienImmobilier) {
      this.delegationGestionData.append('images', image);
    }

    this.delegationGestionData.append('delegationGestionJson', JSON.stringify(this.delegationGestionForm2));
    this.delegationGestionData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.delegationGestionService.enregistrerDelegationGestion(this.delegationGestionData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { delegationReussie: true } });
        } else {
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'enregistrement !"
          this.afficherFormulaireEnregistrerDelegation();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'enregistrement",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      this.delegationGestionData.delete('images');
      this.delegationGestionData.delete('delegationGestionJson');
      this.delegationGestionData.delete('caracteristiquesJson');
      if (error.error === "La matricule du propriétaire est introuvable !") {
        this.messageErreur = "La matricule du propriétaire est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      } else if (error.error === "Le code de l'immeuble ou de la maison est introuvable !") {
        this.messageErreur = "Le code de l'immeuble ou de la maison est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
    })
  }

  deleguerBienAssocie(): void {
    if (this.isUserDemarcheurOrGerant()) {
      this.deleguerBienAssocieIfUserDemarcheurOrGerant();
    } else {
      this.deleguerBienAssocieIfUserNotDemarcheurOrGerant();
    }
  }

  deleguerBienAssocieIfUserDemarcheurOrGerant(): void {
    this.delegationGestionForm2.typeDeBien = this.typeDeBienSelectionne;
    this.delegationGestionForm2.categorie = this.categorieSelectionnee;

    for (const image of this.imagesBienImmobilier) {
      this.delegationGestionData.append('images', image);
    }

    this.delegationGestionData.append('delegationGestionJson', JSON.stringify(this.delegationGestionForm2));
    this.delegationGestionData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.delegationGestionService.enregistrerDelegationGestion(this.delegationGestionData).subscribe(
      (response) => {
        console.log(response)
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { delegationReussie: true } });
        } else {
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'enregistrement !"
          this.afficherFormulaireEnregistrerDelegation();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      this.delegationGestionData.delete('images');
      this.delegationGestionData.delete('delegationGestionJson');
      this.delegationGestionData.delete('caracteristiquesJson');
      if (error.error === "La matricule du propriétaire est introuvable !") {
        this.messageErreur = "La matricule du propriétaire est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      } else if (error.error === "Le code de l'immeuble ou de la maison est introuvable !") {
        this.messageErreur = "Le code de l'immeuble ou de la maison est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
    })
  }

  deleguerBienAssocieIfUserNotDemarcheurOrGerant(): void {
    this.delegationGestionForm2.typeDeBien = this.typeDeBienSelectionne;
    this.delegationGestionForm2.categorie = this.categorieSelectionnee;
    this.delegationGestionForm2.agenceImmobiliere = this.agenceSelectionnee;

    for (const image of this.imagesBienImmobilier) {
      this.delegationGestionData.append('images', image);
    }

    this.delegationGestionData.append('delegationGestionJson', JSON.stringify(this.delegationGestionForm2));
    this.delegationGestionData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.delegationGestionService.enregistrerDelegationGestion(this.delegationGestionData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions'], { queryParams: { delegationReussie: true } });
          this.messageSuccess = "Le délégation de gestion a été enregistrer avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Enregistrement réussi',
            detail: this.messageSuccess
          });
        } else {
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'enregistrement !"
          this.afficherFormulaireEnregistrerDelegation();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'enregistrement",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      this.delegationGestionData.delete('images');
      this.delegationGestionData.delete('delegationGestionJson');
      this.delegationGestionData.delete('caracteristiquesJson');
      if (error.error === "La matricule du propriétaire est introuvable !") {
        this.messageErreur = "La matricule du propriétaire est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      } else if (error.error === "Le code de l'immeuble ou de la maison est introuvable !") {
        this.messageErreur = "Le code de l'immeuble ou de la maison est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
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
