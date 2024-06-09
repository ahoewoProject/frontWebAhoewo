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
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { Motif } from 'src/app/models/Motif';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
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

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  delegationGestion = this.delegationGestionService.delegationGestion;
  delegationGestionForm2: DelegationGestionForm2 = new DelegationGestionForm2();
  bienImmobilier!: any;
  bienImmAssocie!: any;
  delegationGestions!: Page<DelegationGestion>;
  images: ImagesBienImmobilier[] = [];
  caracteristique: Caracteristiques = new Caracteristiques();
  categorieSelectionnee = '';
  messageErreur: string = "";
  messageSuccess: string | null = null;
  step1Form: any;
  step2Form: any;

  APIEndpoint: string;

  delegationReussie: any;
  modificationReussie: any;
  delegationGestionData: FormData = new FormData();
  bienImmobilierData: FormData = new FormData();

  publicationForm: any;
  publication = this.publicationService.publication;
  bienAPublie: any;
  listMotifs: Motif[] = [];
  planificationsPaiements!: Page<PlanificationPaiement>;
  planificationPaiement: any;
  codeContrat: any;
  paiement: any;

  constructor(private delegationGestionService: DelegationGestionService, private personneService: PersonneService,
    private messageService: MessageService, private bienImmobilierService: BienImmobilierService,
    private activatedRoute: ActivatedRoute, private caracteristiqueService: CaracteristiquesService,
    private confirmationService: ConfirmationService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private bienImmAssocieService: BienImmAssocieService, private publicationService: PublicationService,
    private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.delegationReussie = this.activatedRoute.snapshot.queryParamMap.get('delegationReussie') || '';
    this.modificationReussie = this.activatedRoute.snapshot.queryParamMap.get('modificationReussie') || '';

    this.initActivatedRoute();
    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    this.initResponsiveOptions();

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

  listeDelegationsGestions(numeroDeLaPage: number, elementsParPage: number): void {
    this.delegationGestionService.getDelegationsGestionsPaginees(numeroDeLaPage, elementsParPage).subscribe(
      (data) => {
        this.delegationGestions = data;
        if (this.delegationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Délégation de gestion réussie', detail: 'Le bien correspondant a été délégué avec succès.' });
        }
        if (this.modificationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Modification réussie', detail: 'Le bien délégué a été modifié avec succès.' });
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

  voirListeDelegationsGestions(): void {
    this.resetPublicationForm();
    this.imgURLs = [];
    this.imagesBienImmobilier = [];
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
        if (response.typeDeBien.designation !== 'Terrain') {
          this.detailCaracteristiques(id);
        }
      }
    );
  }

  //Fonction pour afficher les détails d'un bien associé
  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImmAssocie = response;
        this.detailCaracteristiques(id);
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

  isTypeDeBienTerrain(designation: string): boolean {
    return designation == 'Terrain'
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

  afficherChampCategorie(designation: string): boolean {
    return designation == 'Chambre' || designation == 'Chambre salon' || designation == 'Bureau' ||
    designation == 'Appartement' || designation == 'Villa' || designation == 'Maison' ||
    designation == 'Immeuble';
  }

  accepterDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir accepter la délégation de la gestion de ce bien ?',
      header: "Acceptation de la délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.accepterDelegationGestion(id).subscribe(
          (response) => {
            this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage);
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
          this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage);
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
          this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage);
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
          this.listeDelegationsGestions(this.numeroDeLaPage, this.elementsParPage);
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

  //Fonction pour afficher le formulaire déléguer un bien
  afficherFormulaireEnregistrerDelegation(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegation-gestion/add']);
  }

  afficherFormulaireModificationBien(id: number, designation: string): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/update/' + id + '/' + designation]);
  }

  afficherFormulairePublicationBien(delegationGestion: DelegationGestion, bien: BienImmobilier): void {
    this.resetPublicationForm();
    this.bienChoisi(bien);
    localStorage.setItem('delegationGestion', JSON.stringify(delegationGestion));
    const idd = JSON.parse(localStorage.getItem('delegationGestion')!);
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
          this.resetPublicationForm();
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

  retourDetailDelegationGestion(): void {
    const delegationGestionInStore = JSON.parse(localStorage.getItem('delegationGestion')!);
    console.log(delegationGestionInStore)
    this.afficherPageDetail(delegationGestionInStore.id, delegationGestionInStore.bienImmobilier.id);
  }

  voirListeContratsBien(codeBien: string): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-delegues/contrats/', codeBien]);
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
