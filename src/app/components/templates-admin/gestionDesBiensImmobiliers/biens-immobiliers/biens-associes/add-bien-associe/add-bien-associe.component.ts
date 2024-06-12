import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
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
  selector: 'app-add-bien-associe',
  templateUrl: './add-bien-associe.component.html',
  styleUrls: ['./add-bien-associe.component.css']
})
export class AddBienAssocieComponent implements OnInit, OnDestroy {

  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  bienImmobilierData: FormData = new  FormData();

  categorieSelectionnee = '';

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

      if (id) {
        this.detailBienSupport(parseInt(id));
      }
    });
  }


  detailBienSupport(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
      }
    )
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
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', id, 'biens-associes']);
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
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', response.bienImmobilier.id, 'biens-associes'], { queryParams: { ajoutReussi: true }});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmAssocieJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', response.bienImmobilier.id, 'biens-associes'], { queryParams: { ajoutReussi: true }});
        } else {
          this.bienImmobilierData.delete('images');
          this.bienImmobilierData.delete('bienImmAssocieJson');
          this.bienImmobilierData.delete('caracteristiquesJson');
          this.messageErreur = "Erreur lors de l'ajout du bien !"
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
