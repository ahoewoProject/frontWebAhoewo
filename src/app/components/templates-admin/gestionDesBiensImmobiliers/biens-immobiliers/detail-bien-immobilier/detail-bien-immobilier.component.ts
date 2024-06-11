import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
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
  selector: 'app-detail-bien-immobilier',
  templateUrl: './detail-bien-immobilier.component.html',
  styleUrls: ['./detail-bien-immobilier.component.css']
})
export class DetailBienImmobilierComponent implements OnInit, OnDestroy {

  affichage = 1;

  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  typeDeTransactionSelectionne!: string;
  bienImmobilierSelectionne = new BienImmobilier();
  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  caracteristiqueBien: Caracteristiques = new Caracteristiques();

  publication = this.publicationService.publication;
  bienAPublie: any;
  publicationForm: any;

  images: ImagesBienImmobilier[] = [];
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
  typesDeTransactions: string[] = [];
  modificationReussie: any;

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
    this.modificationReussie = this.activatedRoute.snapshot.queryParams['modificationReussie'];
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    this.initActivatedRoute();
    this.initResponsiveOptions();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.voirPageDetailBienSupport(parseInt(id))
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

  //Fonction pour retourner à la liste des biens immobiliers
  voirListeBiens(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports']);
  }

  //Détails d'un bien immobilier
  detailBienSupport(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.getImagesBienImmobilier(response.id);
        this.bienImmobilier = response;
        if (this.bienImmobilier.typeDeBien.designation !== 'Terrain') {
          this.detailCaracteristiquesBien(id);
        }

        if (this.modificationReussie) {
          this.messageSuccess = "Le bien support a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        }
      }
    );
  }

  //Détails caracteristiques d'un bien immobilier
  detailCaracteristiquesBien(id: number) {
    this.caracteristiqueService.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristiqueBien = response;
      }
    );
  }

  async voirPageDetailBienSupport(id: number): Promise<void> {
    this.detailBienSupport(id);
    this.affichage = 1;
  }

  //Fonction pour téléchager les images d'un bien immobilier

  afficherListeBiensAssocies(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', id, 'biens-associes']);
  }

  afficherPageModifier(id: number, designation: string): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/update/bien-support/' + id + '/' + designation]);
  }

  afficherChampCategorie(designation: string): boolean {
    return designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Bureau' ||
    designation == 'Appartement' || designation == 'Villa' || designation == 'Maison' ||
    designation == 'Immeuble';
  }

  afficherPagePublication(bien: BienImmobilier): void {
    this.modificationReussie = false;
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
    if (this.personneService.estProprietaire(this.user.role.code)) {
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
