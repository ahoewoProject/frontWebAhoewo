import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { ContratVente } from 'src/app/models/gestionDesLocationsEtVentes/ContratVente';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';

@Component({
  selector: 'app-planifications-paiements',
  templateUrl: './planifications-paiements.component.html',
  styleUrls: ['./planifications-paiements.component.css']
})
export class PlanificationsPaiementsComponent implements OnInit, OnDestroy {

  url = 'https://sandbox-api.fedapay.com/v1';
  token = 'sk_sandbox_CilfCtbWmwtBJt5mJqGGS2l7';

  recherche: string = '';
  affichage = 1;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  planificationsPaiements!: Page<PlanificationPaiement>;
  planificationsPaiementsList: PlanificationPaiement[] = [];
  planificationPaiement = this.planificationPaiementService.planificationPaiement;
  contratsLocations: ContratLocation[] = [];
  contratsVentes: ContratVente[] = [];
  contratLocation = this.contratLocationService.contratLocation;
  contratVente = this.contratVenteService.contratVente;
  paiement = this.paiementService.paiement;

  typesPlanifications: string[] = [];
  modesPaiements: string[] = [];
  typePlanificationSelectionne!: string;
  modePaiementSelectionne!: string;
  planificationPaiementForm: any;
  paiementForm: any;
  contratSelectionne!: any;
  messageSuccess: string | null = null;
  messageErreur: string | null = null;
  user: any;

  planificationPaiementReussie: any;
  preuve: any;
  preuveUrl: any;
  paiementData: FormData = new  FormData();
  paiementAnnule: any

  constructor(private planificationPaiementService: PlanificationPaiementService,
    private contratVenteService: ContratVenteService, private contratLocationService: ContratLocationService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private personneService: PersonneService, private messageService: MessageService,
    private paiementService: PaiementService,
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.paiementAnnule = this.activatedRoute.snapshot.queryParamMap.get('token');

    this.planificationPaiementReussie = this.activatedRoute.snapshot.queryParams['planificationPaiementReussie'];
    this.initActivatedRoute();
    this.listTypesPlanifications();
    this.listeContratsLocations();
    this.listeContratsVentes();
    this.initPlanificationPaiementForm();
    this.planificationPaiementForm.get('montantPaye').valueChanges.subscribe((value: number) => {
      this.updateRestePayeInputState(value);
    });
    this.initPaiementForm();
    this.listeModesPaiements();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.affichage = 2;
        this.detailPlanificationPaiement(parseInt(id));
      } else {
        this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  listePlanificationsPaiements(numeroDeLaPage: number, elementsParPage: number): void {
    this.planificationPaiementService.getPlanificationsPaiements(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.planificationsPaiements = response;
        if (this.planificationPaiementReussie) {
          this.messageService.add({ severity: 'success', summary: 'Planification de paiement réussi', detail: 'Le planification paiement a été enregistré avec succès.' });
        }
      }
    )
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  retour(): void {
    this.affichage = 1;
    this.planificationPaiementForm.reset();
    this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planifications-paiements']);
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
        if (this.paiementAnnule) {
          this.messageService.add({ severity: 'error', summary: 'Paiement annulé', detail: 'Votre paiement a été annulé.' });
        }
      }
    )
  }

  listeContratsLocations(): void {
    this.contratLocationService.listContratsLocations().subscribe(
      (response) => {
        console.log(response)
        this.contratsLocations = response;
      }
    )
  }

  listeContratsVentes(): void  {
    this.contratVenteService.listContratsVentes().subscribe(
      (response) => {
        console.log(response)
        this.contratsVentes = response;
      }
    )
  }

  listePlanificationsPaiementsByCodeContrat(codeContrat: string): void {
    this.planificationPaiementService.getPlanificationsByCodeContrat(codeContrat).subscribe(
      (data) => {
        this.planificationsPaiementsList = data;
      }
    )
  }

  listTypesPlanifications(): void {
    this.typesPlanifications = ['Paiement de location', 'Paiement d\'achat'];
    this.typePlanificationSelectionne =  this.typesPlanifications[0];
  }

  typePlanificationChoisi(event: any): void {
    this.typePlanificationSelectionne = event.value;
    this.validerPlanificationForm(this.typePlanificationSelectionne);
    if (this.typePlanificationSelectionne == 'Paiement de location') {
      this.listeContratsLocations();
    } else {
      this.listeContratsVentes();
    }
  }

  contratLocationChoisi(event: any): void {
    this.contratSelectionne = event.value;
    this.planificationPaiement.montantDu = this.contratSelectionne.loyer;
  }

  contratVenteChoisi(event: any): void {
    this.contratSelectionne = event.value;
    this.planificationPaiementService.lastPlanificationPaiement(this.contratSelectionne.codeContrat).subscribe(
      (response) => {
        if (response) {
          this.planificationPaiement.montantDu = response.restePaye;
        } else {
          this.planificationPaiement.montantDu = this.contratSelectionne.prixVente;
        }
      }
    )
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contratLocation = response;
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contratVente = response;
        this.listePlanificationsPaiementsByCodeContrat(this.contratVente.codeContrat);
      }
    )
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planification-paiement/' + id]);
  }

  initPlanificationPaiementForm(): void {
    this.planificationPaiementForm = new FormGroup({
      typePlanification: new FormControl('', [Validators.required]),
      contrat: new FormControl('', [Validators.required]),
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

  get typePlanification() {
    return this.planificationPaiementForm.get('typePlanification')
  }

  get contrat () {
    return this.planificationPaiementForm.get('contrat')
  }

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

  afficherPageAjout(): void {
    this.affichage = 3;
    this.listTypesPlanifications();
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
          this.retour();
          this.messageSuccess = "La paiement a été planifié avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Planification de paiement réussie',
            detail: this.messageSuccess
          })
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
          this.retour();
          this.messageSuccess = "La paiement a été planifié avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Planification de paiement réussie',
            detail: this.messageSuccess
          })
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
    } else {
      this.montantPaye.clearValidators();
      this.restePaye.clearValidators();
    }
    this.montantPaye.updateValueAndValidity();
    this.restePaye.updateValueAndValidity();
  }

  initPaiementForm(): void {
    this.paiementForm = new FormGroup({
      modePaiement: new FormControl('', [Validators.required]),
      montant: new FormControl({value: '', disabled: true}, [Validators.required]),
      // numeroComptePaiement: new FormControl('', [Validators.required]),
      // referenceTransaction: new FormControl('', [Validators.required])
    })
  }

  get modePaiement() {
    return this.paiementForm.get('modePaiement')
  }

  get montant() {
    return this.paiementForm.get('montant')
  }

  // get numeroComptePaiement() {
  //   return this.paiementForm.get('numeroComptePaiement')
  // }

  // get referenceTransaction() {
  //   return this.paiementForm.get('referenceTransaction')
  // }

  telecharger(event: any) {
    const uploadedFile: File = event.files[0];
    this.preuve = uploadedFile;

    var reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = (_event)=>{
    this.preuveUrl = reader.result;
    }
    this.messageSuccess = "La preuve liée ce paiement a été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Opération de téléchargement réussie',
      detail: this.messageSuccess
    });
  }

  listeModesPaiements() {
    if (!this.personneService.estClient(this.user.role.code)) {
      this.modesPaiements = ['Hors plateforme'];
      this.modePaiementSelectionne = this.modesPaiements[0];
    } else {
      this.modesPaiements = ['Hors plateforme' , 'Mobile Money', 'Virement bancaire'];
      this.modePaiementSelectionne = this.modesPaiements[0];
    }
  }

  modePaiementChoisi(event: any): void {
    this.modePaiementSelectionne = event.value
    // this.validerPaiementForm(this.modePaiementSelectionne)
    if (this.planificationPaiement) {
      this.paiement.montant = this.planificationPaiement.montantPaye;
    }
  }

  afficherPagePaiement(id: number) {
    this.listeModesPaiements();
    this.planificationPaiementService.findById(id).subscribe(
      (data) => {
        console.log(data);
        this.planificationPaiement = data;
        this.paiement.montant = data.montantPaye;
      }
    )
    this.affichage = 5;
  }

  validerPaiementForm(modePaiement: string) {
    // if (modePaiement == 'Manuel') {
    //   this.numeroComptePaiement.setValidators([Validators.required])
    //   this.referenceTransaction.setValidators([Validators.required])
    // } else if (modePaiement == 'Espèce') {
    //   this.numeroComptePaiement.clearValidators();
    //   this.referenceTransaction.clearValidators();
    // }
    // this.numeroComptePaiement.updateValueAndValidity();
    // this.referenceTransaction.updateValueAndValidity()
  }

  resetPaiementForm() {
    this.preuve = '';
    this.preuveUrl = '';
    this.paiementForm.reset();
  }

  retourPageDetail(id: number): void {
    this.resetPaiementForm();
    this.detailPlanificationPaiement(id);
    this.affichage = 2;
  }

  ajouterPaiement(): void {
    if (this.modePaiementSelectionne == 'Hors plateforme') {
      this.paiementHorsSysteme();
    } else if (this.modePaiementSelectionne == 'Mobile Money') {
      this.paiementParMobileMoney();
    } else {
      this.paiementParVirementBancaire();
    }
  }

  paiementHorsSysteme(): void {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    this.paiementData.append('preuve', this.preuve);
    this.paiementData.append('paiementJson', JSON.stringify(this.paiement));

    this.paiementService.ajouterPaiement(this.paiementData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiements'], { queryParams: { paiementReussi: true } });
        }
      },
      (error) => {
        console.log(error)
        this.messageErreur = "Une erreur s'est produite lors de l'enregistrement !";
        this.messageService.add({
          severity: 'error',
          summary: 'Paiement échoué',
          detail: this.messageErreur
        })
      }
    )
  }

  paiementParMobileMoney() {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    this.paiementData.append('paiementJson', JSON.stringify(this.paiement));
    this.paiementService.initializePaymentByPaydunya(this.paiementData).subscribe(
      (redirectUrl) => {
        console.log(redirectUrl);
        window.open(redirectUrl, '_self');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  paiementParVirementBancaire() {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    console.log(this.paiement)
    this.paiementService.initializePaymentByPayPal(this.paiement).subscribe(
      (redirectUrl) => {
        console.log(redirectUrl);
        window.open(redirectUrl, '_self');
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.resetPlanificationPaiementForm();
  }

}
