import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
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
  selector: 'app-detail-bien-associe',
  templateUrl: './detail-bien-associe.component.html',
  styleUrls: ['./detail-bien-associe.component.css']
})
export class DetailBienAssocieComponent implements OnInit, OnDestroy {

  typesDeTransactions: string[] = [];
  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  affichage = 1;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  bienImmobilierData: FormData = new  FormData();

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
  user: any;
  APIEndpoint: string;
  modificationReussie: any;

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
    this.modificationReussie = this.activatedRoute.snapshot.queryParams['modificationReussie'];
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const idBienAssocie = params.get('idBienAssocie');

      if (id && idBienAssocie) {
        this.detailBienAssocie(parseInt(idBienAssocie));
        this.affichage = 1;
      }
    });
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
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

  voirListeBiensAssocies(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', id, 'biens-associes']);
  }

  detailBienSupport(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
      }
    )
  }

  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (data) => {
        this.getImagesBienImmobilier(data.id);
        this.bienImmAssocie = data;
        this.bienImmobilier = data.bienImmobilier;
         if (this.modificationReussie) {
          this.messageSuccess = "Le bien associé a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        }
        this.detailCaracteristiquesBienAssocie(this.bienImmAssocie.id);
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

  async afficherPageDetailBienAssocie(id: number): Promise<void> {
    this.modificationReussie = false;
    this.detailBienAssocie(id);
    this.affichage = 1;
  }

  afficherPageModifier(id: number, designation: string): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (data) => {
        this.bienImmAssocie = data;
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/' + this.bienImmAssocie.bienImmobilier.id + '/update/bien-associe/' + this.bienImmAssocie.id +'/' + designation]);
      }
    )
  }

  afficherChampCategorie(designation: string): boolean {
    return designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Bureau' ||
    designation == 'Appartement' || designation == 'Villa' || designation == 'Maison' ||
    designation == 'Immeuble';
  }

  afficherPagePublication(bien: BienImmobilier): void {
    this.resetPublicationForm();
    this.bienChoisi(bien);
    this.bienAPublie = bien;
    this.affichage = 2;
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
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/publications'], { queryParams: { publicationReussie: true }});
  }

  afficherCommission(): boolean {
    return (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAgentImmobilier(this.user.role.code) || this.personneService.estDemarcheur(this.user.role.code))
    && (this.typeDeTransactionSelectionne == 'Location' || this.typeDeTransactionSelectionne == 'Vente');
  }

  afficherAvanceEtCaution(): boolean {
    return this.typeDeTransactionSelectionne == 'Location'
  }

  afficherFraisDeVisite(): boolean {
    return (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAgentImmobilier(this.user.role.code) || this.personneService.estDemarcheur(this.user.role.code));
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
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/', codeBien]);
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
