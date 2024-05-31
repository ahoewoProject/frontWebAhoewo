import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Motif } from 'src/app/models/Motif';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { ContratVente } from 'src/app/models/gestionDesLocationsEtVentes/ContratVente';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { SuiviEntretienService } from 'src/app/services/gestionDesLocationsEtVentes/suivi-entretien.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';
import { MotifService } from 'src/app/services/motif.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contrats',
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.css']
})
export class ContratsComponent implements OnInit, OnDestroy {

  recherche: string = '';

  modalRefusVisible: boolean = false;
  modalDemandeModificationContratLocVisible: boolean = false;
  modalDemandeModificationContratVenVisible: boolean = false;
  motifRefusForm = new MotifForm();
  listMotifs: Motif[] = [];
  responsiveOptions: any[] | undefined;
  elementsParPageIndex1 = 5;
  numeroDeLaPageIndex1 = 0;
  menusContratLocation: MenuItem[] | undefined;
  menusContratVente: MenuItem[] | undefined;
  dateDebutSelectionnee!: Date;
  dateFinSelectionnee!: Date | null;

  messageSuccess: string | null = null;
  messageErreur: string | null = null;

  elementsParPageIndex2 = 5;
  numeroDeLaPageIndex2 = 0;

  elementsParPagePlanification = 5;
  numeroDeLaPagePlanification = 0;

  elementsParPagePaiement = 5;
  numeroDeLaPagePaiement = 0;

  affichage = 1;

  contratLocation = this.contratLocationService.contratLocation;
  contratVente = this.contratVenteService.contratVente;

  activeIndex = 0;

  datePrevueSelectionnee!: Date;

  contratsLocations!: Page<ContratLocation>;
  contratsVentes!: Page<ContratVente>;
  planificationsPaiements!: Page<PlanificationPaiement>
  user: any;
  APIEndpoint: string;
  ajoutContratLocationReussie: any;
  ajoutContratVenteReussie: any;
  typesDeContrat: string[] = [];
  typeDeContratSelectionne: any;

  contratId: any;
  codeContrat: any;

  contratLocationStep1Form: any;
  contratLocationStep2Form: any;

  contratVenteFormStep1: any;
  contratVenteFormStep2: any;
  contratVenteFormStep3: any;

  planificationPaiementForm: any;
  planificationPaiement = this.planificationPaiementService.planificationPaiement;

  typesPlanifications: string[] = [];
  typePlanificationSelectionne!: string;
  contratSelectionne!: any;

  suiviEntretien = this.suiviEntretienService.suiviEntretien;
  suiviEntretienForm: any

  paiement = this.paiementService.paiement;
  paiements!: Page<Paiement>
  contrat: any

  constructor(private contratLocationService: ContratLocationService,
    private contratVenteService: ContratVenteService, private messageService: MessageService,
    private personneService: PersonneService, private router: Router,
    private motifService: MotifService, private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService, private planificationPaiementService: PlanificationPaiementService,
    private suiviEntretienService: SuiviEntretienService, private paiementService: PaiementService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.ajoutContratLocationReussie = this.activatedRoute.snapshot.queryParams['ajoutContratLocationReussie'];
    this.ajoutContratVenteReussie = this.activatedRoute.snapshot.queryParams['ajoutContratVenteReussie'];
    this.initResponsiveOptions();

    if (this.ajoutContratLocationReussie) {
      this.activeIndex = 0;
      this.listeContratsLocations(this.numeroDeLaPageIndex1, this.elementsParPageIndex2);
      this.listeContratsVentes(this.numeroDeLaPageIndex2, this.elementsParPageIndex2);
    } else if (this.ajoutContratVenteReussie) {
      this.activeIndex = 1;
      this.listeContratsLocations(this.numeroDeLaPageIndex1, this.elementsParPageIndex2);
      this.listeContratsVentes(this.numeroDeLaPageIndex2, this.elementsParPageIndex2);
    } else {
      this.initActivatedRoute();
    }

    this.listeTypesDeContrat();
    this.initContratLocationStep1Form();
    this.initContratLocationStep2Form();
    this.initContratVenteStep1Form();
    this.initContratVenteStep2Form();
    this.initContratVenteStep3Form();
    this.initPlanificationPaiementForm();
    this.planificationPaiementForm.get('montantPaye').valueChanges.subscribe((value: number) => {
      this.updateRestePayeInputState(value);
    });

    this.initSuiviEntretienForm();
    if (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.menusContratLocationOfAgence();
      this.menusContratVenteOfAgence();
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.menusContratLocationOfDemarcheur();
      this.menusContratVenteOfDemarcheur();
    } else {
      this.menusContratLocationOfOtherUser();
      this.menusContratVenteOfOtherUser();
    }
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

  initActivatedRoute(): void {
    console.log(this.router.url)
    if (this.router.url.includes('locations')) {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        if (id) {
          this.detailContratLocation(id);
          this.affichage = 2;
        }
      })
    } else if (this.router.url.includes('ventes')) {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        if (id) {
          this.detailContratVente(id);
          this.affichage = 3;
        }
      })
    } else {
      if (this.activatedRoute.snapshot.queryParams['activeIndex']) {
        this.activeIndex = this.activatedRoute.snapshot.queryParams['activeIndex'];
      }

      this.listeContratsLocations(this.numeroDeLaPageIndex1, this.elementsParPageIndex2);
      this.listeContratsVentes(this.numeroDeLaPageIndex2, this.elementsParPageIndex2);
    }
  }

  menusContratLocationOfAgence(): void {
    this.menusContratLocation = [
      {
          label: 'Client'
      },
      {
          label: 'Agence'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusContratLocationOfDemarcheur(): void {
    this.menusContratLocation = [
      {
          label: 'Client'
      },
      {
          label: 'Demarcheur'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusContratLocationOfOtherUser(): void {
    this.menusContratLocation = [
      {
          label: 'Client'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusContratVenteOfAgence(): void {
    this.menusContratVente = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Agence'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusContratVenteOfDemarcheur(): void {
    this.menusContratVente = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Demarcheur'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusContratVenteOfOtherUser(): void {
    this.menusContratVente = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  selectDateDebut(event: any): void {
    this.dateDebutSelectionnee = event;
  }

  selectDateFin(event: any): void {
    this.dateFinSelectionnee = event;
  }

  listeTypesDeContrat(): void {
    this.typesDeContrat = ['Contrat de bail habitation', 'Contrat de bail construction'];
    this.typeDeContratSelectionne = this.typesDeContrat[0];
  }

  initContratLocationStep1Form(): void {
    this.contratLocationStep1Form = new FormGroup({
      typeContrat: new FormControl('', [Validators.required]),
      loyer: new FormControl('', [Validators.required]),
      avance: new FormControl(''),
      caution: new FormControl(''),
      debutPaiement: new FormControl('', [Validators.required]),
      jourSupplementPaiement: new FormControl(''),
      dateDebut: new FormControl('', [Validators.required]),
      dateFin: new FormControl(''),
    })
  }

  initContratLocationStep2Form(): void {
    this.contratLocationStep2Form = new FormGroup({
      commission: new FormControl(''),
      fraisDeVisite: new FormControl(''),
    })
  }

  get typeContrat() {
    return this.contratLocationStep1Form.get('typeContrat');
  }

  get loyer() {
    return this.contratLocationStep1Form.get('loyer');
  }

  get avance() {
    return this.contratLocationStep1Form.get('avance');
  }

  get caution() {
    return this.contratLocationStep1Form.get('caution');
  }

  get debutPaiement() {
    return this.contratLocationStep1Form.get('debutPaiement');
  }

  get jourSupplementPaiement() {
    return this.contratLocationStep1Form.get('jourSupplementPaiement');
  }

  get dateDebut() {
    return this.contratLocationStep1Form.get('dateDebut');
  }

  get dateFin() {
    return this.contratLocationStep1Form.get('dateFin');
  }

  get commission() {
    return this.contratLocationStep2Form.get('commission');
  }

  get fraisDeVisite() {
    return this.contratLocationStep2Form.get('fraisDeVisite');
  }

  resetContratLocationStep1Form(): void {
    this.contratLocationStep1Form.reset();
  }

  calculerProchainPaiement(dateDebut: Date, jourSupplementPaiement: number, debutPaiement: number): Date {
    const prochainPaiementDate = new Date(dateDebut);
    prochainPaiementDate.setDate(prochainPaiementDate.getDate() + jourSupplementPaiement);
    prochainPaiementDate.setMonth(prochainPaiementDate.getMonth() + debutPaiement);
    return prochainPaiementDate;
  }

  listeContratsLocations(numeroDeLaPage: number, elementsParPage: number): void {
    this.contratLocationService.getContratsLocations(numeroDeLaPage, elementsParPage).subscribe(
      (data) => {
        this.contratsLocations = data;
        if (this.ajoutContratLocationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Proposition de contrat réussie', detail: 'La proposition de contrat de location a été soumise avec succès.' });
        }
      }
    )
  }

  listeContratsVentes(numeroDeLaPage: number, elementsParPage: number): void {
    this.contratVenteService.getContratsVentes(numeroDeLaPage, elementsParPage).subscribe(
      (data) => {
        this.contratsVentes = data;
        if (this.ajoutContratVenteReussie) {
          this.messageService.add({ severity: 'success', summary: 'Proposition de contrat réussie', detail: 'La proposition de contrat de vente a été soumise avec succès.' });
        }
      }
    )
  }

  paginationListeContratsLocations(event: any) {
    this.numeroDeLaPageIndex1 = event.first / event.rows;
    this.elementsParPageIndex2 = event.rows;
    this.listeContratsLocations(this.numeroDeLaPageIndex1, this.elementsParPageIndex2);
  }

  paginationListeContratsVentes(event: any) {
    this.numeroDeLaPageIndex2 = event.first / event.rows;
    this.elementsParPageIndex2 = event.rows;
    this.listeContratsVentes(this.numeroDeLaPageIndex2, this.elementsParPageIndex2);
  }

  afficherPageDetailContratLocation(id: number) {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/locations', id]);
  }

  afficherPageDetailContratVente(id: number) {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/ventes', id]);
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contratLocation = response;
        if (this.user.role.code == 'ROLE_CLIENT') {
          this.listeMotifs(this.contratLocation.codeContrat, this.contratLocation.refuserPar);
        } else {
          this.listeMotifs(this.contratLocation.codeContrat, this.contratLocation.annulerPar);
        }
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contratVente = response;
        if (this.user.role.code == 'ROLE_CLIENT') {
          this.listeMotifs(this.contratVente.codeContrat, this.contratVente.refuserPar);
        } else {
          this.listeMotifs(this.contratVente.codeContrat, this.contratVente.annulerPar);
        }
      }
    )
  }

  listeMotifs(code: string, creerPar: number): void {
    this.motifService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: Motif[]) => {
        this.listMotifs = data;
      }
    );
  }

  retourDetailContrat(): void {
    if (this.router.url.includes('locations')) {
      this.affichage = 2;
    } else if (this.router.url.includes('ventes')) {
      this.affichage = 3;
    }
  }

  voirListe(): void {
    this.affichage = 1;
    if (this.router.url.includes('locations')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats'], { queryParams: { activeIndex: 0 }});
    } else if (this.router.url.includes('ventes')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats'], { queryParams: { activeIndex: 1 }});
    }
  }

  afficherModalRefus(): void {
    this.modalRefusVisible = true;
  }

  afficherModalDemandeModificationContratLoc(id: number, code: string): void {
    this.contratId = id;
    this.codeContrat = code;
    this.modalDemandeModificationContratLocVisible = true;
  }

  afficherModalDemandeModificationContratVen(id: number, code: string): void {
    this.contratId = id;
    this.codeContrat = code;
    this.modalDemandeModificationContratVenVisible = true;
  }

  dialogueNotVisible(): void {
    this.modalRefusVisible = false;
    this.modalDemandeModificationContratLocVisible = false;
    this.modalDemandeModificationContratVenVisible = false;
  }

  enregistrerMotifRefuserContratLoc(): void {
    this.contratLocationService.refuserContratLocation(this.contratLocation.id, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.detailContratLocation(this.contratLocation.id);
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/locations', this.contratLocation.id]);
        this.messageSuccess = "Le contrat de location a été refusé avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Refus du contrat de location confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  enregistrerMotifRefuserContratVente(): void {
    this.contratVenteService.refuserContratVente(this.contratVente.id, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.detailContratVente(this.contratVente.id);
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/ventes', this.contratVente.id]);
        this.messageSuccess = "Le contrat de vente a été refusé avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Refus du contrat de vente confirmé',
          detail: this.messageSuccess
        })
      }
    )
  }

  enregistrerMotifDemandeModifiContratLoc(): void {
    this.contratLocationService.demandeModificationContratLocation(this.contratId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalDemandeModificationContratLocVisible = false;
        this.listeContratsLocations(this.numeroDeLaPageIndex1, this.elementsParPageIndex1);
        this.activeIndex = 0;
        this.messageSuccess = "La demande de modification du contrat de location " + this.codeContrat + " a été envoyée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Demande de modification du contrat de location confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  enregistrerMotifDemandeModifiContratVen(): void {
    this.contratVenteService.demandeModificationContratVente(this.contratId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalDemandeModificationContratVenVisible = false;
        this.listeContratsVentes(this.numeroDeLaPageIndex2, this.elementsParPageIndex2);
        this.activeIndex = 0;
        this.messageSuccess = "La demande de modification du contrat de vente " + this.codeContrat + " a été envoyée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Demande de modification du contrat de vente confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  afficherPageModifierContratLocation(id: number): void {
    this.affichage = 5;
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contratLocation = response;
        this.dateDebutSelectionnee = new Date(this.contratLocation.dateDebut);
        this.dateFinSelectionnee = this.contratLocation.dateFin ? new Date(this.contratLocation.dateFin) : null;
        this.typeDeContratSelectionne = this.contratLocation.typeContrat;
      }
    )
  }

  afficherPageModifierContratVente(id: number): void {
    this.affichage = 6;
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contratVente = response;
      }
    )
  }

  modifierContratLocation(id: number): void {
    this.contratLocation.typeContrat = this.typeDeContratSelectionne;
    this.contratLocation.bienImmobilier = this.contratLocation.demandeLocation.publication.bienImmobilier;
    if (this.contratLocation.demandeLocation.publication.bienImmobilier.estDelegue) {
      this.contratLocation.proprietaire = this.contratLocation.demandeLocation.publication.bienImmobilier.personne;

      if (this.contratLocation.demandeLocation.publication.agenceImmobiliere) {
        this.contratLocation.agenceImmobiliere = this.contratLocation.demandeLocation.publication.agenceImmobiliere;
      } else if (this.contratLocation.demandeLocation.publication.personne &&
        this.contratLocation.demandeLocation.publication.personne.role &&
        this.contratLocation.demandeLocation.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratLocation.demarcheur = this.contratLocation.demandeLocation.publication.personne
      } else if (this.contratLocation.demandeLocation.publication.personne &&
        this.contratLocation.demandeLocation.publication.personne.role &&
        this.contratLocation.demandeLocation.publication.personne.role.code == 'ROLE_GERANT') {
        this.contratLocation.gerant = this.contratLocation.demandeLocation.publication.personne
      }
    } else {
      if (this.contratLocation.demandeLocation.publication.agenceImmobiliere) {
        this.contratLocation.agenceImmobiliere = this.contratLocation.demandeLocation.publication.agenceImmobiliere;
      } else if (this.contratLocation.demandeLocation.publication.personne &&
        this.contratLocation.demandeLocation.publication.personne.role &&
        this.contratLocation.demandeLocation.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratLocation.demarcheur = this.contratLocation.demandeLocation.publication.personne
      } else if (this.contratLocation.demandeLocation.publication.personne &&
        this.contratLocation.demandeLocation.publication.personne.role &&
        this.contratLocation.demandeLocation.publication.personne.role.code == 'ROLE_PROPRIETAIRE') {
        this.contratLocation.proprietaire = this.contratLocation.demandeLocation.publication.bienImmobilier.personne;
      }
    }

    this.contratLocationService.modifierContratLocation(id, this.contratLocation).subscribe(
      (response) => {
        this.detailContratLocation(this.contratLocation.id);
        this.affichage = 2;
        this.messageSuccess = "Le contrat de location a été modifié avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Modification du contrat de location confirmée',
          detail: this.messageSuccess
        })
      }
    );
  }

  //Arrêter contrat location
  terminerContratLocation(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir terminer ce contrat de location ?',
      header: "Terminer un contrat de location",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contratLocationService.mettreFin(id).subscribe(
          (response) => {
          this.detailContratLocation(id);
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/locations', id]);
          this.messageSuccess = "Le contrat de location a été terminée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Terminaison d\'un contrat de location confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Terminaison d\'un contrat de location rejetée',
              detail: "Vous avez rejeté la terminaison de ce contrat de location!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Terminaison d\'un contrat de location annulée',
              detail: "Vous avez annulé la terminaison de ce contrat de location !"
            });
            break;
        }
      }
    });
  }

  //Valider contrat de location
  validerContratLocation(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider ce contrat de location ?',
      header: "Validation d'un contrat de location",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contratLocationService.validerContratLocation(id).subscribe(
          (response) => {
            this.detailContratLocation(id);
            this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/locations', id]);
            this.messageSuccess = "Le contrat de location a été validée avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Validation d\'un contrat de location confirmée',
              detail: this.messageSuccess
            })
          },
          (error) => {
            if (error.status == 409) {
              this.messageSuccess = 'Un contrat de location est déjà en cours pour ce bien immobilier.'
              this.messageService.add({
                severity: 'error',
                summary: 'Validation d\'un contrat de location échouée',
                detail: this.messageSuccess
              });
            }
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'un contrat de location rejetée',
              detail: "Vous avez rejeté la validation de ce contrat de location!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'un contrat de location annulée',
              detail: "Vous avez annulé la validation de ce contrat de location !"
            });
            break;
        }
      }
    });
  }

  initContratVenteStep1Form(): void {
    this.contratVenteFormStep1 = new FormGroup({
      prixVente: new FormControl('', [Validators.required]),
      nombreDeTranche: new FormControl('', [Validators.required]),
    })
  }

  get prixVente() {
    return this.contratVenteFormStep1.get('prixVente')
  }

  get nombreDeTranche() {
    return this.contratVenteFormStep1.get('nombreDeTranche')
  }

  resetContratVenteForm(): void {
    this.contratVenteFormStep1.reset();
  }

  initContratVenteStep2Form(): void {
    this.contratVenteFormStep2 = new FormGroup({
      nomPrenomTemoin1Vendeur: new FormControl('', [Validators.required]),
      contactTemoin1Vendeur: new FormControl('', [Validators.required]),
      nomPrenomTemoin2Vendeur: new FormControl(''),
      contactTemoin2Vendeur: new FormControl(''),
      nomPrenomTemoin3Vendeur: new FormControl(''),
      contactTemoin3Vendeur: new FormControl(''),

      nomPrenomTemoin1Acheteur: new FormControl('', [Validators.required]),
      contactTemoin1Acheteur: new FormControl('', [Validators.required]),
      nomPrenomTemoin2Acheteur: new FormControl(''),
      contactTemoin2Acheteur: new FormControl(''),
      nomPrenomTemoin3Acheteur: new FormControl(''),
      contactTemoin3Acheteur: new FormControl(''),
    })
  }

  get nomPrenomTemoin1Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin1Vendeur')
  }

  get contactTemoin1Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin1Vendeur')
  }

  get nomPrenomTemoin2Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin2Vendeur')
  }

  get contactTemoin2Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin2Vendeur')
  }

  get nomPrenomTemoin3Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin3Vendeur')
  }

  get contactTemoin3Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin3Vendeur')
  }

  get nomPrenomTemoin1Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin1Acheteur')
  }

  get contactTemoin1Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin1Acheteur')
  }

  get nomPrenomTemoin2Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin2Acheteur')
  }

  get contactTemoin2Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin2Acheteur')
  }

  get nomPrenomTemoin3Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin3Acheteur')
  }

  get contactTemoin3Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin3Acheteur')
  }

  initContratVenteStep3Form(): void {
    this.contratVenteFormStep3 = new FormGroup({
      commission: new FormControl(''),
      fraisDeVisite: new FormControl(''),
    })
  }

  get commissionContratVente() {
    return this.contratVenteFormStep3.get('commission');
  }

  get fraisDeVisiteContratVente() {
    return this.contratVenteFormStep3.get('fraisDeVisite');
  }

  modifierContratVente(id: number): void {
    this.contratVente.bienImmobilier = this.contratVente.demandeAchat.publication.bienImmobilier;
    if (this.contratVente.demandeAchat.publication.bienImmobilier.estDelegue) {
      this.contratVente.proprietaire = this.contratVente.demandeAchat.publication.bienImmobilier.personne;

      if (this.contratVente.demandeAchat.publication.agenceImmobiliere) {
        this.contratVente.agenceImmobiliere = this.contratVente.demandeAchat.publication.agenceImmobiliere;
      } else if (this.contratVente.demandeAchat.publication.personne &&
        this.contratVente.demandeAchat.publication.personne.role &&
        this.contratVente.demandeAchat.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratVente.demarcheur = this.contratVente.demandeAchat.publication.personne
      } else if (this.contratVente.demandeAchat.publication.personne &&
        this.contratVente.demandeAchat.publication.personne.role &&
        this.contratVente.demandeAchat.publication.personne.role.code == 'ROLE_GERANT') {
        this.contratVente.gerant = this.contratVente.demandeAchat.publication.personne
      }
    } else {
      if (this.contratVente.demandeAchat.publication.agenceImmobiliere) {
        this.contratVente.agenceImmobiliere = this.contratVente.demandeAchat.publication.agenceImmobiliere;
      } else if (this.contratVente.demandeAchat.publication.personne &&
        this.contratVente.demandeAchat.publication.personne.role &&
        this.contratVente.demandeAchat.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratVente.demarcheur = this.contratVente.demandeAchat.publication.personne
      } else if (this.contratVente.demandeAchat.publication.personne &&
        this.contratVente.demandeAchat.publication.personne.role &&
        this.contratVente.demandeAchat.publication.personne.role.code == 'ROLE_PROPRIETAIRE') {
        this.contratVente.proprietaire = this.contratVente.demandeAchat.publication.bienImmobilier.personne;
      }
    }

    this.contratVenteService.modifierContratVente(id, this.contratVente).subscribe(
      (response) => {
        this.detailContratVente(this.contratVente.id);
        this.affichage = 3;
        this.messageSuccess = "Le contrat de vente a été modifié avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Modification du contrat de vente confirmée',
          detail: this.messageSuccess
        })
      }
    );
  }

  //Valider contrat de vente
  validerContratVente(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider ce contrat de vente ?',
      header: "Validation d'un contrat de vente",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contratVenteService.validerContratVente(id).subscribe(
          (response) => {
            this.detailContratVente(id);
            this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats/ventes', id]);
            this.messageSuccess = "Le contrat de vente a été validée avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Validation d\'un contrat de vente confirmée',
              detail: this.messageSuccess
            })
          },
          (error) => {
            if (error.status == 409) {
              this.messageSuccess = 'Un contrat de vente est déjà validé pour ce bien immobilier.'
              this.messageService.add({
                severity: 'error',
                summary: 'Validation d\'un contrat de location échouée',
                detail: this.messageSuccess
              });
            }
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'un contrat de vente rejetée',
              detail: "Vous avez rejeté la validation de ce contrat de vente!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'un contrat de vente annulée',
              detail: "Vous avez annulé la validation de ce contrat de vente !"
            });
            break;
        }
      }
    });
  }

  etape1(): void {
    this.activeIndex = 0;
  }

  etape2(): void {
    this.activeIndex = 1;
  }

  etape3(): void {
    this.activeIndex = 2;
  }

  etape4(): void {
    this.activeIndex = 3;
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

  telechargerContratLocation(id: number): void {
    this.contratLocationService.telecharger(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
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

  initPlanificationPaiementForm(): void {
    this.planificationPaiementForm = new FormGroup({
      // typePlanification: new FormControl('', [Validators.required]),
      // contrat: new FormControl('', [Validators.required]),
      libelle: new FormControl('', [Validators.required]),
      montantDu: new FormControl('', [Validators.required]),
      montantPaye: new FormControl(''),
      restePaye: new FormControl({value: '', disabled: true}),
      datePlanifiee: new FormControl('', [Validators.required])
    })
  }

  updateRestePayeInputState(montantPaye: number): void {
    const restePayeControl = this.planificationPaiementForm.get('restePaye');
    restePayeControl.setValue(this.planificationPaiement.montantDu - montantPaye);
    restePayeControl.disable();
  }

  // get typePlanification() {
  //   return this.planificationPaiementForm.get('typePlanification')
  // }

  // get contrat () {
  //   return this.planificationPaiementForm.get('contrat')
  // }

  get libelle() {
    return this.planificationPaiementForm.get('libelle')
  }

  get montantDu() {
    return this.planificationPaiementForm.get('montantDu')
  }

  get montantPaye() {
    return this.planificationPaiementForm.get('montantPaye')
  }

  get restePaye() {
    return this.planificationPaiementForm.get('restePaye')
  }

  get datePlanifiee() {
    return this.planificationPaiementForm.get('datePlanifiee')
  }

  resetPlanificationPaiementForm(): void {
    this.planificationPaiementForm.reset();
  }

  voirFormulairePlanificationLoc(contratLocation: any): void {
    this.contratSelectionne = contratLocation;
    this.typePlanificationSelectionne = 'Paiement de location';
    this.validerPlanificationForm(this.typePlanificationSelectionne);
    this.planificationPaiement.montantDu = this.contratSelectionne.loyer;
    this.affichage = 7;
  }

  voirFormulairePlanificationAchat(contratVente: any): void {
    this.contratSelectionne = contratVente;
    this.typePlanificationSelectionne = 'Paiement d\'achat';
    this.validerPlanificationForm(this.typePlanificationSelectionne);
    this.planificationPaiementService.lastPlanificationPaiement(this.contratSelectionne.codeContrat).subscribe(
      (response) => {
        if (response) {
          this.planificationPaiement.montantDu = response.restePaye;
        } else {
          this.planificationPaiement.montantDu = this.contratSelectionne.prixVente;
        }
      }
    )
    this.affichage = 7;
  }

  ajoutPlanificationPaiement(): void {
    if (this.typePlanificationSelectionne == 'Paiement de location') {
      this.ajouterPlanificationPaiementLocation();
    } else {
      this.ajouterPlanificationPaiementAchat();
    }
  }

  ajouterPlanificationPaiementLocation(): void {
    this.planificationPaiement.typePlanification = this.typePlanificationSelectionne;
    this.planificationPaiement.contrat = this.contratSelectionne;
    this.planificationPaiement.montantPaye = this.planificationPaiement.montantDu;
    this.planificationPaiement.restePaye = this.planificationPaiement.montantDu - this.planificationPaiement.montantPaye;
    // console.log(this.planificationPaiement);
    this.planificationPaiementService.ajouterPlanificationPaiementLocation(this.planificationPaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/planifications-paiements'], { queryParams: { planificationPaiementReussie: true } });
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la planification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Planification de paiement échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        console.log(error)
        if (error.error == "Une planification de paiement existe déjà pour ce contrat à la date spécifiée.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Planification de paiement non réussie',
            detail: error.error
          })
        }
      }
    )
  }

  ajouterPlanificationPaiementAchat(): void {
    this.planificationPaiement.typePlanification = this.typePlanificationSelectionne;
    this.planificationPaiement.contrat = this.contratSelectionne;
    this.planificationPaiementService.ajouterPlanificationPaiementLocation(this.planificationPaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/planifications-paiements'], { queryParams: { planificationPaiementReussie: true } });
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la planification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Planification de paiement échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        console.log(error)
        if (error.error == "Une planification de paiement existe déjà pour ce contrat à la date spécifiée.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Planification de paiement non réussie',
            detail: error.error
          })
        }
      }
    )
  }

  validerPlanificationForm(typePlanification: string): void {
    if (typePlanification == 'Paiement d\'achat') {
      this.montantPaye.setValidators([Validators.required]);
      this.restePaye.setValidators([Validators.required]);
    }
    this.montantPaye.updateValueAndValidity();
    this.restePaye.updateValueAndValidity();
  }

  initSuiviEntretienForm(): void {
    this.suiviEntretienForm = new FormGroup({
      // contratLocation: new FormControl(''),
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      datePrevue: new FormControl('', [Validators.required]),
    })
  }

  // get contratLocation() {
  //   return this.suiviEntretienForm.get('contratLocation')
  // }

  get libelleSuiviEntretien() {
    return this.suiviEntretienForm.get('libelle')
  }

  get description() {
    return this.suiviEntretienForm.get('description')
  }

  get datePrevue() {
    return this.suiviEntretienForm.get('datePrevue')
  }

  afficherFormulaireSuiviEntretien(contratLocation: ContratLocation): void {
    this.suiviEntretien.contratLocation = contratLocation;
    this.affichage = 8;
  }

  datePrevueChoisie(event: any): void {
    this.datePrevueSelectionnee = event;
  }

  annuler(): void {
    this.suiviEntretienForm.reset();
  }

  ajouterSuiviEntretien(): void {
    this.suiviEntretienService.ajouterSuiviEntretien(this.suiviEntretien).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/suivis-entretiens'], { queryParams: { suiviEntretienReussi: true } });
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.messageService.add({
            severity: 'error',
            summary: 'Ajout échoué',
            detail: this.messageErreur
          })
        }
      }
    )
  }

  listePlanificationsPaiementParCodeContrat(codeContrat: string, numeroDeLaPagePlanification: number, elementsParPagePlanification: number) {
    this.planificationPaiementService.getPlanificationsPaiementsByCodeContrat(codeContrat, numeroDeLaPagePlanification, elementsParPagePlanification).subscribe(
      (response) => {
        this.planificationsPaiements = response;
      }
    )
  }

  voirListePlanificationsPaiements(contrat: any): void {
    this.codeContrat = contrat.codeContrat;
    this.contrat = contrat;
    this.listePlanificationsPaiementParCodeContrat(this.codeContrat, this.numeroDeLaPagePlanification, this.elementsParPagePlanification);
    this.affichage = 9;
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

  voirPageDetailPaiementParCodePlanification(codePlanification: string): void {
    this.detailPaiementParCodePlanification(codePlanification);
    this.affichage = 11;
  }

  listePaiementsByCodeContrat(codeContrat: string, numeroDeLaPagePaiement: number, elementsParPagePaiement: number): void {
    this.paiementService.getPaiementsByCodeContrat(codeContrat, numeroDeLaPagePaiement, elementsParPagePaiement).subscribe(
      (response) => {
        this.paiements = response;
      }
    )
  }

  voirListePaiements(contrat: any): void {
    this.contrat = contrat;
    this.codeContrat = contrat.codeContrat;
    this.listePaiementsByCodeContrat(this.codeContrat, this.numeroDeLaPagePaiement, this.elementsParPagePaiement);
    this.affichage = 12;
  }

  paginationPaiement(event: any) {
    this.numeroDeLaPagePaiement = event.first / event.rows;
    this.elementsParPagePaiement = event.rows;
    this.listePaiementsByCodeContrat(this.codeContrat, this.numeroDeLaPagePaiement, this.elementsParPagePaiement);
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

  voirPageDetailPaiementParContratId(contratId: number): void {
    this.detailPaiementParContratId(contratId);
    this.affichage = 13;
  }

  telechargerFichePaiement(id: number): void {
    this.paiementService.telechargerFichePaiement(id).subscribe(
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
