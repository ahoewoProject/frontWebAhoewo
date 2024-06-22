import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { DelegationGestionForm1 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm1';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
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
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-biens-immobiliers',
  templateUrl: './biens-immobiliers.component.html',
  styleUrls: ['./biens-immobiliers.component.css']
})
export class BiensImmobiliersComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  affichage = 1;
  recherche: string = '';
  elementsParPage = 5;
  numeroDeLaPage = 0;
  activeIndex: number = 0;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  typeDeTransactionSelectionne!: string;
  agenceSelectionnee = new AgenceImmobiliere();
  bienImmobilierSelectionne = new BienImmobilier();
  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  caracteristiqueBien: Caracteristiques = new Caracteristiques();

  delegationGestionForm:  any;
  delegationGestionForm1 = new DelegationGestionForm1();

  biensImmobiliers!: Page<BienImmobilier>;
  images: ImagesBienImmobilier[] = [];
  imagesBienImmobilier: any[] = [];
  imgURLs: any[] = [];

  responsiveOptions: any[] | undefined;
  user: any;
  APIEndpoint: string;
  ajoutReussi: any;

  constructor(private personneService: PersonneService, private messageService: MessageService,
    private paysService: PaysService, private regionService: RegionService,
    private villeService: VilleService, private quartierService: QuartierService,
    private typeDeBienService: TypeDeBienService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private agenceImmobiliereService: AgenceImmobiliereService, private bienImmobilierService: BienImmobilierService,
    private confirmationService: ConfirmationService, private router: Router, private activatedRoute: ActivatedRoute,
    private caracteristiqueService: CaracteristiquesService, private publicationService: PublicationService,
    private delegationGestionService: DelegationGestionService, private sanitizer: DomSanitizer,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.loadData();
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.ajoutReussi = this.activatedRoute.snapshot.queryParams['ajoutReussi'];
    this.initResponsiveOptions();
    this.initDelegationGestionForm();

    this.listeBiensSupportPagines(this.numeroDeLaPage, this.elementsParPage);
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

  listeBiensSupportPagines(numeroDeLaPage: number, elementsParPage: number) {
    this.bienImmobilierService.getBiensSupportsPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.biensImmobiliers = response;
        if (this.ajoutReussi) {
          this.messageSuccess = "Le bien support a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        }
      }
    );
  }

  afficherListeBiens(): void {
    this.ajoutReussi = false;
    this.affichage = 1;
    this.listeBiensSupportPagines(this.numeroDeLaPage, this.elementsParPage);
  }

  paginationListeBiens(event: any) {
    this.ajoutReussi = false;
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeBiensSupportPagines(this.numeroDeLaPage, this.elementsParPage);
  }

  afficherPageAjout(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/add/bien-support']);
  }

  afficherPageDetailBienSupport(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/' + id]);
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
          this.afficherListeBiens();
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
          this.afficherListeBiens();
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

  afficherFormulaireDelegationGestionBien(id: number): void {
    this.listeDesChoix = [ 'Gérant', 'Démarcheur', 'Agence immobilière'];
    this.checked = this.listeDesChoix[0];
    this.bienImmobilierService.findById(id).subscribe(
      (data) => {
        this.bienImmobilier = data;
      }
    );
    const event = {value: this.checked};
    this.onChoixChange(event);
    this.affichage = 2;
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
          this.afficherFormulaireDelegationGestionBien(response.bienImmobilier.id);
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
          this.afficherFormulaireDelegationGestionBien(this.bienImmobilier.id);
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
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
