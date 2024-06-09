import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilierAssocie } from 'src/app/models/gestionDesBiensImmobiliers/BienImmAssocie';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { DelegationGestionForm1 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm1';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-biens-associes',
  templateUrl: './biens-associes.component.html',
  styleUrls: ['./biens-associes.component.css']
})
export class BiensAssociesComponent implements OnInit, OnDestroy {

  typesDeTransactions: string[] = [];
  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  recherche: string = '';
  affichage = 1;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  delegationGestionForm:  any;

  bienImmobilierData: FormData = new  FormData();
  delegationGestionForm1 = new DelegationGestionForm1();

  publication = this.publicationService.publication;
  typeDeTransactionSelectionne!: string;
  categorieSelectionnee = '';
  bienAPublie: any;
  publicationForm: any;

  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];

  elementsParPage = 5;
  numeroDeLaPage = 0;
  activeIndex: number = 0;

  bienStep1Form: any;
  bienStep2Form: any;

  responsiveOptions: any[] | undefined;
  menus: MenuItem[] | undefined;
  images: ImagesBienImmobilier[] = [];

  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  bienImmAssocie = this.bienImmAssocieService.bienImmobilierAssocie;
  caracteristiqueBienAssocie: Caracteristiques = new Caracteristiques();
  typeDeBienSelectionne = new TypeDeBien();
  biensImmAssocies!: Page<BienImmobilierAssocie>;
  user: any;
  APIEndpoint: string;

  typesDeBienPourMaison: TypeDeBien[] = [];
  typesDeBienPourImmeuble: TypeDeBien[] = [];
  typesDeBienPourVilla: TypeDeBien[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private bienImmAssocieService: BienImmAssocieService, private bienImmobilierService: BienImmobilierService,
    private personneService: PersonneService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private caracteristiqueService: CaracteristiquesService, private delegationGestionService: DelegationGestionService,
    private publicationService: PublicationService, private typeDeBienService: TypeDeBienService,
    private sanitizer: DomSanitizer
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    this.initDelegationGestionForm();
    this.initActivatedRoute();

    this.initBienStep1Form();
    this.initBienStep2Form();

    this.listeTypeDeBienPourMaison();
    this.listeTypeDeBienPourVilla();
    this.listeTypeDeBienPourImmeuble();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const idBienAssocie = params.get('idBienAssocie');

      if (id && idBienAssocie) {
        this.afficherPageDetailBienAssocie(parseInt(idBienAssocie));
      } else if (id) {
        this.detailBienSupport(parseInt(id));
        this.listeBiensAssocies(parseInt(id), this.numeroDeLaPage, this.elementsParPage);
      }
    });
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

  //Fonction pour sélectionner un type de bien
  typeDeBienChoisi(event: any) {
    this.typeDeBienSelectionne = event.value;
    this.menusOfOtherTypeDeBien();

    if (this.typeDeBienSelectionne.designation == 'Immeuble' || this.typeDeBienSelectionne.designation == 'Appartement' || this.typeDeBienSelectionne.designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé', 'Meublé'];
    } else if (this.typeDeBienSelectionne.designation == 'Chambre' || this.typeDeBienSelectionne.designation == 'Chambre salon' || this.typeDeBienSelectionne.designation == 'Villa' || this.typeDeBienSelectionne.designation == 'Maison') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    this.validerFormulaireBienImmobilier();
  }

  //Fonction pour sélectionner une catégorie pour un type de bien
  categorieChoisie(event: any) {
    this.categorieSelectionnee = event.value;
  }

  listeBiensAssocies(id: number, numeroDeLaPage: number, elementsParPage: number): void {
    this.bienImmAssocieService.getBiensAssociesPaginesByBienImmobilier(id, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmAssocies = response;
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

  paginationListeBiensAssocies(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeBiensAssocies(this.bienImmobilier.id, this.numeroDeLaPage, this.elementsParPage);
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

  voirListeBiensAssocies(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports/', id, 'biens-associes']);
  }

  afficherListeBiensAssocies(id: number): void {
    this.affichage = 1;
    this.listeBiensAssocies(id, this.numeroDeLaPage, this.elementsParPage);
  }

  detailBienSupport(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
      }
    )
  }

  afficherPageDetailBienSupport(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports/', id]);
  }

  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (data) => {
        this.getImagesBienImmobilier(data.id);
        this.bienImmAssocie = data;
        this.typeDeBienSelectionne = data.typeDeBien;
        this.bienImmobilier = data.bienImmobilier;
        this.detailCaracteristiquesBienAssocie(this.bienImmAssocie.id);
        this.validerFormulaireBienImmobilier();
      }
    )
  }

  //Détails caracteristiques d'un bien associé
  detailCaracteristiquesBienAssocie(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristiqueBienAssocie = response;
      }
    );
  }

  voirPageDetailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImmAssocie = response;
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports/', this.bienImmAssocie.bienImmobilier.id, 'biens-associes', this.bienImmAssocie.id]);
      }
    )
  }

  async afficherPageDetailBienAssocie(id: number): Promise<void> {
    this.detailBienAssocie(id);
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
        resolve();
      };
      reader.onerror = (_event) => {
        reject(reader.error);
      };
    });
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

  afficherPageAjout(): void {
    this.activeIndex = 0;
    this.validerFormulaireBienImmobilier();
    this.bienImmAssocie = new BienImmobilierAssocie();
    this.menusOfOtherTypeDeBien();
    this.affichage = 3;
  }

  //Fonction/ Ajout Bien Associé
  ajouterBienImmAssocie(): void {

    if (this.isUserProprietaireOrDemarcheur()) {
      this.ajouterBienImmAssocieIfUserIsProprietaireOrDemarcheur();
    } else {
      this.ajouterBienImmAssocieIfUserIsResponsableOrAgentImmobilier();
    }
  }

  //Fonction/ Ajout Bien Associé/ Utilisateur Propriétaire-Démarcheur
  ajouterBienImmAssocieIfUserIsProprietaireOrDemarcheur(): void {
    this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmAssocie.categorie = this.categorieSelectionnee;
    this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
    this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
    this.bienImmAssocie.adresse = this.bienImmobilier.adresse;
    this.bienImmAssocie.estDelegue = this.bienImmobilier.estDelegue;

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
          this.afficherListeBiensAssocies(response.bienImmobilier.id);
          this.messageSuccess = "Le bien associé a été ajouté avec succès.";
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
          this.afficherPageAjout();
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
      console.log(error)
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

  //Fonction/ Ajout Bien Associé/ Utilisateur Responsable-AgentImmobilier
  ajouterBienImmAssocieIfUserIsResponsableOrAgentImmobilier(): void {
    this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmAssocie.categorie = this.categorieSelectionnee;
    this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
    this.bienImmAssocie.quartier = this.bienImmobilier.quartier;
    this.bienImmAssocie.adresse = this.bienImmobilier.adresse;
    this.bienImmAssocie.estDelegue = this.bienImmobilier.estDelegue;

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
          this.afficherListeBiensAssocies(response.bienImmobilier.id);
          this.messageSuccess = "Le bien associé a été ajouté avec succès.";
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
          this.afficherPageAjout();
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

  afficherPageModifier(id: number, designation: string): void {
    if (designation == 'Appartement' || designation == 'Bureau') {
      this.listeDesCategories = ['Non meublé','Meublé'];
    } else if (designation == 'Chambre' || designation == 'Chambre salon') {
      this.listeDesCategories = ['Non meublée', 'Meublée'];
    }
    this.affichage = 4;
    this.activeIndex = 0;
    this.detailBienAssocie(id);
    this.menusOfOtherTypeDeBien();
    this.validerFormulaireBienImmobilier();
  }

  //Fonction/ Modifier Bien associé
  modifierBienImmAssocie(id: number): void {

    if (this.isUserProprietaireOrDemarcheur()) {
      this.modifierBienAssocieIfUserIsProprietaireOrDemarcheur(id);
    } else {
      this.modifierBienAssocieIfUserIsResponsableOrAgentImmobilier(id);
    }
  }

  //Fonction/ Modifier Bien associé/ Utilisateur Propriétaire-Démarcheur
  modifierBienAssocieIfUserIsProprietaireOrDemarcheur(id: number): void {
    this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmAssocie.bienImmobilier = this.bienImmobilier;
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
          this.afficherPageDetailBienAssocie(id);
          this.messageSuccess = "Le bien associé a été modifié avec succès.";
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
          this.afficherPageModifier(id, response.typeDeBien.designation);
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

  //Fonction/ Modifier Bien associé/ Utilisateur Responsable-AgentImmobilier
  modifierBienAssocieIfUserIsResponsableOrAgentImmobilier(id: number): void {
    this.bienImmAssocie.typeDeBien = this.typeDeBienSelectionne;
    this.bienImmAssocie.bienImmobilier = this.bienImmobilier;;
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
          this.afficherPageDetailBienAssocie(id);
          this.messageSuccess = "Le bien associé a été modifié avec succès.";
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
          this.afficherPageModifier(id, response.typeDeBien.designation);
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
      console.log(error);
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

  //Fonction pour activer un bien immobilier
  activerBienImmobilier(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce bien immobilier ?',
      header: "Activation d'un bien immobilier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bienImmobilierService.activerBienImmobilier(id).subscribe(
        (response) => {
          this.voirListeBiensAssocies(id);
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
          this.voirListeBiensAssocies(id);
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

  //Fonction/ Valider formulaire Bien Immobilier
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

    if (this.isTypeDeBienBoutiqueOrMagasin()) {
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

  private isTypeDeBienBoutiqueOrMagasin(): boolean {
    return this.typeDeBienSelectionne.designation == 'Boutique' || this.typeDeBienSelectionne.designation == 'Magasin';
  }

  private setOtherValidatorsBasedOnRole(): void {
    if (this.isUserProprietaireOrDemarcheur()) {
      this.agenceImmobiliere.clearValidators();
    } else {
      this.agenceImmobiliere.clearValidators();
    }
  }

  private isUserProprietaireOrDemarcheur(): boolean {
    return this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR';
  }

  afficherPageDelegationGestion(id: number): void {
    this.listeDesChoix = [ 'Gérant', 'Démarcheur', 'Agence immobilière'];
    this.checked = this.listeDesChoix[0];
    this.bienImmAssocieService.findById(id).subscribe(
      (data) => {
        this.bienImmAssocie = data;
      }
    )
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

  annulerDelegationGestion(): void {
    this.delegationGestionForm.reset;
  }

  //Fonction pour ajouter une délégation de gestion
  ajouterDelegationGestion(): void {
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.delegationGestionToGerantOrDemarcheur();
    } else {
      this.delegationGestionToAgenceImmobiliere();
    }
  }
  delegationGestionToGerantOrDemarcheur(): void {
    this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
    this.delegationGestionService.addDelegationGestionMatricule(this.delegationGestionForm1).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
        } else {
          this.messageErreur = "Erreur lors de la délégation de gestion !"
          this.afficherPageDelegationGestion(response.bienImmobilier.id);
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
  }

  delegationGestionToAgenceImmobiliere(): void {
    this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
    this.delegationGestionService.addDelegationGestionCodeAgence(this.delegationGestionForm1).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
        } else {
          this.messageErreur = "Erreur lors de la délégation de gestion !"
          this.afficherPageDelegationGestion(this.bienImmobilier.id);
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

  afficherPagePublication(bien: BienImmobilier): void {
    this.resetPublicationForm();
    this.bienChoisi(bien);
    this.bienAPublie = bien;
    this.affichage = 6;
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

  listeTypeDeTransactions(): void {
    this.typesDeTransactions = ['Location', 'Vente'];
    this.typeDeTransactionSelectionne = this.typesDeTransactions[0];
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
          this.resetPublicationForm();
          this.redirectToPublicationPage();
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.afficherPagePublication(this.bienAPublie);
          this.messageService.add({
            severity: 'error',
            summary: 'Publication échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        this.messageErreur = error.error;
        let messageDetail = '';

        switch (this.messageErreur) {
          case "Un contrat de location est toujours en cours pour ce bien immobilier.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec un des biens associés à ce bien support est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          default:
            messageDetail = "Erreur inconnue";
            break;
        }

        if (messageDetail !== "Erreur inconnue") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: messageDetail
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

  voirListeContratsBien(codeBien: string): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens/contrats/', codeBien]);
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
