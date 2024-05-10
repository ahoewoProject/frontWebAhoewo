import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType, MenuItem } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
import { DelegationGestionForm2 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm2';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { ContratVente } from 'src/app/models/gestionDesLocationsEtVentes/ContratVente';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { MotifRejet } from 'src/app/models/MotifRejet';
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
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { MotifRejetService } from 'src/app/services/motif-rejet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delegations-gestions',
  templateUrl: './delegations-gestions.component.html',
  styleUrls: ['./delegations-gestions.component.css']
})
export class DelegationsGestionsComponent implements OnInit, OnDestroy {

  listeDesChoix: any[] | undefined;
  checked: string | undefined;
  responsiveOptions: any[] | undefined;
  typesDeTransactions: string[] = [];
  typeDeTransactionSelectionne!: string;
  menus: MenuItem[] | undefined;
  listeDesCategories: string[] = [];
  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];
  recherche: string = '';
  user: any;
  affichage = 1;
  visibleAddForm = 0;
  activeIndex: number = 0;
  activeIndexContrat: number = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  elementsParPageContratVente = 5;
  elementsParPageContratLocation = 5
  numeroDeLaPageContratVente = 0;
  numeroDeLaPageContratLocation = 0;

  elementsParPagePlanification = 5;
  numeroDeLaPagePlanification = 0;

  delegationGestion = this.delegationGestionService.delegationGestion;
  delegationGestionForm2: DelegationGestionForm2 = new DelegationGestionForm2();
  bienImmobilier!: any;
  bienImmAssocie!: any;
  codeBien!: any;
  contrat!: any;
  contratsLocations!: Page<ContratLocation>;
  contratsVentes!: Page<ContratVente>;
  contratBien!: any;
  delegationGestions!: Page<DelegationGestion>;
  images: ImagesBienImmobilier[] = [];
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

  APIEndpoint: string;

  delegationReussie: any;
  delegationGestionData: FormData = new FormData();
  bienImmobilierData: FormData = new FormData();

  publicationForm: any;
  publication = this.publicationService.publication;
  bienAPublie: any;
  listMotifs: MotifRejet[] = [];
  planificationsPaiements!: Page<PlanificationPaiement>;
  planificationPaiement: any;
  codeContrat: any;
  paiement: any;

  constructor(private delegationGestionService: DelegationGestionService, private personneService: PersonneService,
    private messageService: MessageService, private bienImmobilierService: BienImmobilierService,
    private activatedRoute: ActivatedRoute, private paysService: PaysService,
    private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private caracteristiqueService: CaracteristiquesService,
    private confirmationService: ConfirmationService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private agenceImmobiliereService: AgenceImmobiliereService, private typeDeBienService: TypeDeBienService,
    private bienImmAssocieService: BienImmAssocieService, private publicationService: PublicationService,
    private router: Router, private contratLocationService: ContratLocationService,
    private contratVenteService: ContratVenteService, private motifRejetService: MotifRejetService,
    private planificationPaiementService: PlanificationPaiementService, private paiementService: PaiementService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.delegationReussie = this.activatedRoute.snapshot.queryParamMap.get('delegationReussie') || '';
    this.initActivatedRoute();
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    this.initResponsiveOptions();
    this.menusOfTerrain();

    this.initStep1Form();
    this.initStep2Form();


    this.listeTypesDeBienActifs();
    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage);
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
      const idBien = this.activatedRoute.snapshot.queryParamMap.get('idBien');

      if (id) {
        this.affichage = 2;
        this.detailDelegationGestion(parseInt(id));
        if (idBien) {
          this.getImagesBienImmobilier(parseInt(idBien))
        }
      }
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

  listeDelegationsGestions(numeroDeLaPage: number, elementsParPage: number): void {
    this.delegationGestionService.getDelegationsGestionsPaginees(numeroDeLaPage, elementsParPage).subscribe(
      (data) => {
        this.delegationGestions = data;
        if (this.delegationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Délégation de gestion réussie', detail: 'Le bien correspondant a été délégué avec succès.' });
        }
      }
    )
  }

  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id)
    .subscribe((response) => {
      this.images = response;
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

  //Fonction pour recupérer la liste des agences immobilieres par agent immobilier
  listeAgencesImmobilieresParAgent(): void {
    this.agenceImmobiliereService.findAgencesByAgent().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
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

  voirListeDelegationsGestions(): void {
    // this.step1Form.reset();
    // this.step2Form.reset();
    // this.resetPublicationForm();
    // this.imgURLs = [];
    // this.imagesBienImmobilier = [];
    // this.delegationGestionForm2 = new DelegationGestionForm2();
    // this.typeDeBienSelectionne = new TypeDeBien();
    // this.categorieSelectionnee = '';
    // this.paysSelectionne = new Pays();
    // this.regionSelectionnee = new Region();
    // this.villeSelectionnee = new Ville();
    // this.quartierSelectionne = new Quartier();
    // this.delegationGestionData.delete('images');
    // this.delegationGestionData.delete('delegationGestionJson');
    // this.delegationGestionData.delete('caracteristiquesJson');
    // if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
    //   this.listeDelegationGestionProprietaire(this.numeroDeLaPage, this.elementsParPage);
    // } else if (this.user.role.code == 'ROLE_DEMARCHEUR' || this.user.role.code == 'ROLE_GERANT') {
    //   this.listeDelegationGestionGestionnaire(this.numeroDeLaPage, this.elementsParPage);
    // } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
    //   this.listeDelegationsGestionsOfAgencesByResponsable(this.numeroDeLaPage, this.elementsParPage);
    // } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
    //   this.listeDelegationsGestionsOfAgencesByAgent(this.numeroDeLaPage, this.elementsParPage);
    // }
    // this.delegationReussie = false;
    this.affichage = 1;
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions']);
  }

  paginationListeDelegationsGestions(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage)
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiques(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  //Fonction pour afficher les détails d'un bien immobilier
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

  detailDelegationGestion(id: number): void {
    this.delegationGestionService.findById(id).subscribe(
      (response) => {
        this.delegationGestion = response;
        if (this.isBienAssocie(response.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(response.bienImmobilier.id);
        } else {
          this.detailBienImmobilier(response.bienImmobilier.id);
        }
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

  afficherPageDetail(idDelegationGestion: number, idBienImmobilier: number): void {
    this.getImagesBienImmobilier(idBienImmobilier)
    this.detailDelegationGestion(idDelegationGestion);
    this.affichage = 2;
  }

  //Page détail par url
  voirPageDetail(idDelegationGestion: number, idBien: number): void {
    this.getImagesBienImmobilier(idBien);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegations-gestions', idDelegationGestion], { queryParams: { idBien: idBien } });
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

  accepterDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir accepter la délégation de la gestion de ce bien ?',
      header: "Acceptation de la délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.accepterDelegationGestion(id).subscribe(
          (response) => {
            this.voirListeDelegationsGestions()
            this.messageSuccess = "La délégation de la gestion de ce bien a été accepté avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Acceptation de la délégation de gestion d\'un bien confirmée',
              detail: this.messageSuccess
            });
          },
          error => {
            if (error.status == 400) {
              this.messageErreur = "Impossible d'accepter cette délégation de gestion car ce bien est délégué à un autre utilisateur !"
              this.messageService.add({
                severity: 'warn',
                summary: 'Acceptation de la délégation de gestion impossible',
                detail: this.messageErreur
              })
            } else {
              this.messageErreur = "Une erreur s'est produite lors de l'acceptation de la délégation de gestion !"
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur lors de l\'acceptation de la délégation de gestion',
                detail: this.messageErreur
              })
            }
          }
        );
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Acceptation de la délégation de gestion d\'un bien rejetée',
              detail: "Vous avez rejeté l'acceptation de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Acceptation de la délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé l'acceptation de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

  refuserDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir refuser la délégation de la gestion de ce bien ?',
      header: "Refus de la délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.refuserDelegationGestion(id).subscribe(response=>{
          this.voirListeDelegationsGestions()
          this.messageSuccess = "La délégation de la gestion de ce bien a été refusé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Refus de la délégation de gestion d\'un bien confirmé',
            detail: this.messageSuccess
          });
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Refus de la délégation de gestion d\'un bien rejeté',
              detail: "Vous avez rejeté le refus de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Refus de la délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé le refus de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

  activerDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer la délégation de la gestion de ce bien ?',
      header: "Activation d'une délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.activerDelegationGestion(id).subscribe(response=>{
          this.voirListeDelegationsGestions()
          this.messageSuccess = "La délégation de la gestion de ce bien a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de la délégation de gestion d\'un bien confirmée',
            detail: this.messageSuccess
          });
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation d\'une délégation de gestion d\'un bien rejeté',
              detail: "Vous avez rejeté l'activation de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation d\'une délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé l'activation de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

  desactiverDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver la délégation de la gestion de ce bien ?',
      header: "Désactivation d'une délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.desactiverDelegationGestion(id).subscribe(response=>{
          this.voirListeDelegationsGestions()
          this.messageSuccess = "La délégation de la gestion de ce bien a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation de la délégation de gestion d\'un bien confirmée',
            detail: this.messageSuccess
          });
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation d\'une délégation de gestion d\'un bien rejeté',
              detail: "Vous avez rejeté la désactivation de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation d\'une délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé la désactivation de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
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

  //Fonction pour afficher le formulaire déléguer un bien
  afficherFormulaireEnregistrerDelegation(): void {
    this.listeDesChoix = [ 'Totale', 'Partielle'];
    this.checked = this.listeDesChoix[0];
    this.activeIndex = 0;
    this.caracteristique = new Caracteristiques();
    this.typeDeBienSelectionne = this.typesDeBien[0]
    this.agenceSelectionnee = this.agencesImmobilieres[0];
    this.validateDelegationGestionForm();
    this.affichage = 3;
  }

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
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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
          this.delegationGestionData.delete('images');
          this.delegationGestionData.delete('delegationGestionJson');
          this.delegationGestionData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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

  validateUpdateBienForm(): void {
    this.setTypeDeBienValidatorsWithUpdateBienForm();

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

  afficherFormulaireModificationBien(id: number, designation: string): void {
    if (designation == 'Terrain' || designation == 'Maison' || designation == 'Immeuble') {
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
    this.affichage = 4;
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
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.voirListeDelegationsGestions();
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
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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
    this.bienImmAssocie.bienImmobilier = this.bienImmAssocie.bienImmobilier;

    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('images', image);
    }

    this.bienImmobilierData.append('bienImmAssocieJson', JSON.stringify(this.bienImmAssocie));
    this.bienImmobilierData.append('caracteristiquesJson', JSON.stringify(this.caracteristique));

    this.bienImmAssocieService.updateBienImmAssocie(id, this.bienImmobilierData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmAssocieJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.voirListeDelegationsGestions();
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

  afficherFormulairePublicationBien(delegationGestion: DelegationGestion, bien: BienImmobilier): void {
    this.bienChoisi(bien);
    localStorage.setItem('delegationGestion', JSON.stringify(delegationGestion));
    const idd = JSON.parse(localStorage.getItem('delegationGestion')!);
    console.log(idd);
    this.bienAPublie = bien;
    this.affichage = 5;
  }

  initialiserPublicationForm(): void {
    this.publicationForm = new FormGroup({
      typeDeTransaction: new FormControl('', [Validators.required]),
      libelle: new FormControl('', [Validators.required]),
      prixDuBien: new FormControl('', [Validators.required]),
      avance: new FormControl(''),
      caution: new FormControl(''),
      commission: new FormControl({value: '', disabled: true}),
    })
  }

  updateCommissionInputState(prix: number): void {
    const commissionControl = this.publicationForm.get('commission');
    if (this.typeDeTransactionSelectionne == 'Vente' && prix <= 100000000) {
      commissionControl.setValue(10);
      commissionControl.disable();
    } else {
      commissionControl.enable();
    }
  }

  get avance () {
    return this.publicationForm.get('avance');
  }

  get caution () {
    return this.publicationForm.get('caution');
  }

  get commission () {
    return this.publicationForm.get('commission');
  }

  get typeDeTransaction() {
    return this.publicationForm.get('typeDeTransaction');
  }

  get libelle() {
    return this.publicationForm.get('libelle');
  }

  get prixDuBien() {
    return this.publicationForm.get('prixDuBien');
  }

  bienChoisi(bien: BienImmobilier): void {
    if (this.isTypeBienTerrain(bien.typeDeBien.designation)) {
      this.typesDeTransactions = ['Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienSupport(bien.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location', 'Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienAssocie(bien.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    }
  }

  ajouterPublication(): void {
    this.publication.bienImmobilier = this.bienAPublie;
    this.publication.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.publicationService.ajouterPublication(this.publication).subscribe(
      (response) => {
        if (response.id > 0) {
          this.redirectToPublicationPage();
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.afficherFormulairePublicationBien(JSON.parse(localStorage.getItem('delegationGestion')!), this.bienAPublie);
          this.messageService.add({
            severity: 'error',
            summary: 'Publication échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        if (error.error =  "Un contrat de location est toujours en cours pour ce bien immobilier.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          })
        } else if (error.error == "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        } else if (error.error == "Une publication avec un des biens associés à ce bien support est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        } else if (error.error == "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        }
      }
    )
  }

  redirectToPublicationPage(): void {
    this.resetPublicationForm();
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.router.navigate(['/responsable/agences-immobilieres/publications'], { queryParams: { publicationReussie: true }});
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.router.navigate(['/agent-immobilier/agences-immobilieres/publications'], { queryParams: { publicationReussie: true }});
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.router.navigate(['/demarcheur/publications'], { queryParams: { publicationReussie: true }});
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.router.navigate(['/proprietaire/publications'], { queryParams: { publicationReussie: true }});
    }
  }

  afficherCommission(): boolean {
    return (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER' || this.user.role.code == 'ROLE_DEMARCHEUR')
    && (this.typeDeTransactionSelectionne == 'Location' || this.typeDeTransactionSelectionne == 'Vente');
  }

  afficherAvanceEtCaution(): boolean {
    return this.typeDeTransactionSelectionne == 'Location'
  }

  afficherFraisDeVisite(): boolean {
    return (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER' || this.user.role.code == 'ROLE_DEMARCHEUR');
  }

  private isTypeBienTerrain(designation :string): boolean {
    return designation === "Terrain";
  }

  private isTypeDeBienSupport(designation: string): boolean {
    return designation === "Maison" || designation === 'Villa' || designation === "Immeuble";
  }

  private isTypeDeBienAssocie(designation: string): boolean {
    return designation === "Appartement" || designation === "Chambre salon" || designation === "Chambre" ||
      designation === "Bureau" || designation === "Magasin" || designation === "Boutique";
  }

  resetPublicationForm(): void {
    this.publicationForm.reset();
  }

  afficherBoutonSiBienDelegue(estDelegue: boolean): boolean {
    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      if (estDelegue) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  retourDetailDelegationGestion(): void {
    const delegationGestionInStore = JSON.parse(localStorage.getItem('delegationGestion')!);
    console.log(delegationGestionInStore)
    this.afficherPageDetail(delegationGestionInStore.id, delegationGestionInStore.bienImmobilier.id);
  }

  afficherContratVente(contratBien: BienImmobilier) {
    return contratBien.typeDeBien.designation == 'Terrain' ||
    contratBien.typeDeBien.designation == 'Villa' ||
    contratBien.typeDeBien.designation == 'Maison' ||
    contratBien.typeDeBien.designation == 'Immeuble';
  }

  afficherContratLocation(contratBien: BienImmobilier) {
    return contratBien.typeDeBien.designation == 'Maison' ||
    contratBien.typeDeBien.designation == 'Immeuble' ||
    contratBien.typeDeBien.designation == 'Villa' ||
    contratBien.typeDeBien.designation == 'Chambre' ||
    contratBien.typeDeBien.designation == 'Chambre salon' ||
    contratBien.typeDeBien.designation == 'Appartement' ||
    contratBien.typeDeBien.designation == 'Magasin' ||
    contratBien.typeDeBien.designation == 'Bureau'
  }

  voirListeContrats(codeBien: string, contratBien: BienImmobilier): void {
    this.contratBien = contratBien;
    this.listeContratsLocationsByCodeBien(codeBien, this.numeroDeLaPageContratLocation, this.elementsParPageContratLocation);
    this.listeContratsVentesByCodeBien(codeBien, this.numeroDeLaPageContratVente, this.elementsParPageContratVente);
    this.affichage = 6;
  }

  listeContratsLocationsByCodeBien(codeBien: string, numeroDeLaPageContratLocation: number, elementsParPageContatLocation: number): void {
    this.contratLocationService.getContratsLocationsByCodeBien(codeBien, numeroDeLaPageContratLocation, elementsParPageContatLocation).subscribe(
      (response) => {
        this.contratsLocations = response;
      }
    )
  }

  listeContratsVentesByCodeBien(codeBien: string, numeroDeLaPageContratVente: number, elementsParPageContratVente: number): void {
    this.contratVenteService.getContratsVentesByCodeBien(codeBien, numeroDeLaPageContratVente, elementsParPageContratVente).subscribe(
      (response) => {
        this.contratsVentes = response;
      }
    )
  }

  paginationContratVente(event: any) {
    this.numeroDeLaPageContratVente = event.first / event.rows;
    this.elementsParPageContratVente = event.rows;
    this.listeContratsVentesByCodeBien(this.codeBien, this.numeroDeLaPageContratVente, this.elementsParPageContratVente);
  }

  paginationContratLocation(event: any) {
    this.numeroDeLaPageContratLocation = event.first / event.rows;
    this.elementsParPageContratLocation = event.rows;
    this.listeContratsLocationsByCodeBien(this.codeBien, this.numeroDeLaPageContratLocation, this.elementsParPageContratLocation);
  }

  afficherDetailDelegationGestion() {
    this.affichage = 2;
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contrat = response;
        if (this.user.role.code == 'ROLE_CLIENT') {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.refuserPar);
        } else {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.annulerPar);
        }
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contrat = response;
        if (this.user.role.code == 'ROLE_CLIENT') {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.refuserPar);
        } else {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.annulerPar);
        }
      }
    )
  }

  afficherPageDetailContratVente(id: number): void {
    this.detailContratVente(id);
    this.affichage = 8;
  }

  afficherPageDetailContratLocation(id: number): void {
    this.detailContratLocation(id);
    this.affichage = 7;
  }

  retourListeContrats() {
    this.affichage = 6;
  }

  listeMotifs(code: string, creerPar: number): void {
    this.motifRejetService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: MotifRejet[]) => {
        this.listMotifs = data;
      }
    );
  }

  telechargerContratLocation(id: number): void {
    this.contratLocationService.telecharger(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });

        // Créer un objet URL pour le fichier PDF
        const fileURL = URL.createObjectURL(file);

        // Ouvrir le PDF dans un nouvel onglet
        window.open(fileURL, '_blank');
      }
    )
  }

  telechargerContratVente(id: number): void {
    this.contratVenteService.telecharger(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });

        // Créer un objet URL pour le fichier PDF
        const fileURL = URL.createObjectURL(file);

        // Ouvrir le PDF dans un nouvel onglet
        window.open(fileURL, '_blank');
      }
    )
  }

  calculerProchainPaiement(dateDebut: Date, jourSupplementPaiement: number, debutPaiement: number): Date {
    const prochainPaiementDate = new Date(dateDebut);
    prochainPaiementDate.setDate(prochainPaiementDate.getDate() + jourSupplementPaiement);
    prochainPaiementDate.setMonth(prochainPaiementDate.getMonth() + debutPaiement);
    return prochainPaiementDate;
  }

  afficherCategorie(designation: string): boolean {
    return designation == 'Maison' ||
    designation == 'Villa' ||
    designation == 'Immeuble' ||
    designation == 'Appartement' ||
    designation == 'Chambre salon' ||
    designation == 'Chambre' ||
    designation == 'Bureau';
  }

  voirListePlanificationsPaiements(contrat: any): void {
    this.codeContrat = contrat.codeContrat;
    this.contrat = contrat;
    this.listePlanificationsPaiementParCodeContrat(this.codeContrat, this.numeroDeLaPagePlanification, this.elementsParPagePlanification);
    this.affichage = 9;
  }

  listePlanificationsPaiementParCodeContrat(codeContrat: string, numeroDeLaPagePlanification: number, elementsParPagePlanification: number) {
    this.planificationPaiementService.getPlanificationsPaiementsByCodeContrat(codeContrat, numeroDeLaPagePlanification, elementsParPagePlanification).subscribe(
      (response) => {
        this.planificationsPaiements = response;
      }
    )
  }

  detailPlanificationPaiement(id: number): void {
    this.planificationPaiementService.findById(id).subscribe(
      (response) => {
        this.planificationPaiement = response;
        if (this.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.planificationPaiement.contrat.id);
        }
      }
    )
  }

  afficherPageDetailPlanificationPaiement(id: number): void {
    this.detailPlanificationPaiement(id);
    this.affichage = 10;
  }

  paginationPlanificationPaiement(event: any) {
    this.numeroDeLaPagePlanification = event.first / event.rows;
    this.elementsParPagePlanification = event.rows;
    this.listePlanificationsPaiementParCodeContrat(this.codeContrat, this.numeroDeLaPagePlanification, this.elementsParPagePlanification);
  }

  detailPaiementParCodePlanification(codePlanification: string): void {
    this.paiementService.findByCodePlanification(codePlanification).subscribe(
      (response) => {
        this.paiement = response;
        if (this.paiement.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.paiement.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.paiement.planificationPaiement.contrat.id);
        }
      }
    )
  }

  detailPaiementParContratId(contratId: number): void {
    this.paiementService.findByContratId(contratId).subscribe(
      (response) => {
        this.paiement = response;
        if (this.paiement.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.paiement.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.paiement.planificationPaiement.contrat.id);
        }
      }
    )
  }

  voirPageDetailPaiementParCodePlanification(codePlanification: string): void {
    this.detailPaiementParCodePlanification(codePlanification);
    this.affichage = 11;
  }

  voirPageDetailPaiementParContratId(contratId: number): void {
    this.detailPaiementParContratId(contratId);
    this.affichage = 17;
  }

  telechargerFichePaiement(id: number): void {
    this.paiementService.telecharger(id).subscribe(
      (response) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
      }
    )
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
