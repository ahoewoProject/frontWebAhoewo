import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-publication',
  templateUrl: './update-publication.component.html',
  styleUrls: ['./update-publication.component.css']
})
export class UpdatePublicationComponent implements OnInit, OnDestroy {

  responsiveOptions: any[] | undefined;
  typesDeTransactions: string[] = [];
  typeDeTransactionSelectionne!: string;

  user: any;
  biensImmobiliers: BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  bienImm!: any;
  bienSelectionne!: BienImmobilier;
  publication = this.publicationService.publication;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();

  APIEndpoint: string;
  publicationForm: any;

  constructor(private publicationService: PublicationService, private activatedRoute: ActivatedRoute,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private personneService: PersonneService, private caracteristiquesServices: CaracteristiquesService,
    private imagesBienImmobilierService: ImagesBienImmobilierService, private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initResponsiveOptions();
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    if (this.personneService.estProprietaire(this.user.role.code)) {
      this.listeBiensPropres();
    } else {
      this.listeBiensPropresEtDelegues();
    }
    this.listeTypeDeTransactions();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.detailPublication(parseInt(id));
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
      }
    );
  }

  initialiserPublicationForm(): void {
    this.publicationForm = new FormGroup({
      bienImmobilier: new FormControl('', [Validators.required]),
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

  get bienImmobilier() {
    return this.publicationForm.get('bienImmobilier');
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

  // Liste des biens propres et délégués(Responsable, Agent immobilier, Démarcheur, Gérant)
  listeBiensPropresEtDelegues(): void {
    this.bienImmobilierService.getBiensPropresDelegues().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  // Liste des biens d'un propriétaire
  listeBiensPropres(): void {
    this.bienImmobilierService.getBiensByProprietaire().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  detailPublication(id: number): void {
    this.publicationService.findById(id).subscribe(
      (response) => {
        this.publication = response;
        this.bienSelectionne = this.publication.bienImmobilier;
        this.typeDeTransactionSelectionne = this.publication.typeDeTransaction;
        if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.publication.bienImmobilier.id);
        }

        if (this.isTypeBienTerrain(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Vente'];
        } else if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Location', 'Vente'];
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Location'];
        }
      }
    )
  }

  //Page détails par url
  voirPageDetail(idPublication: number, idBien: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/publication', idPublication], { queryParams: { idBien: idBien } });
  }

  //Fonction pour afficher les détails d'un bien immobilier
  detailBienImmobilier(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        if (!this.isTypeBienTerrain(this.bienImm.typeDeBien.designation)) {
          this.detailCaracteristiquesBien(id);
        }
      }
    );
  }

  //Fonction pour afficher les détails d'un bien associé
  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        this.detailCaracteristiquesBien(id);
      }
    );
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiquesServices.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  listeTypeDeTransactions(): void {
    this.typesDeTransactions = ['Location', 'Vente'];
    this.typeDeTransactionSelectionne = this.typesDeTransactions[0];
  }

  bienChoisi(event: any) {
    this.bienSelectionne = event.value;
    if (this.isTypeBienTerrain(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienSupport(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location', 'Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienAssocie(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    }
  }

  typeDeTransactionChoisi(event: any) {
    this.typeDeTransactionSelectionne = event.value;
  }

  voirFormulaireModifier(id: number): void {
    this.detailPublication(id);
  }

  modifierPublication(): void {
    this.publicationService.updatePublication(this.publication.id, this.publication).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/publication', response.id], {
            queryParams: {
                idBien: response.bienImmobilier.id,
                modificationReussie: true
            }
        });
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la modification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Modification échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        // console.log(error)
        // if (error.error == "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // } else if (error.error == "Une publication avec un des biens associés à ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // } else if (error.error == "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // }
      }
    )
  }

  resetPublicationForm(): void {
    this.publicationForm.reset();
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

  ngOnDestroy(): void {

  }
}
