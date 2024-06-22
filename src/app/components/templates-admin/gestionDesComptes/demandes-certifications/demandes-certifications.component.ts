import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './demandes-certifications.component.html',
  styleUrls: ['./demandes-certifications.component.css']
})
export class DemandesCertificationsComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  agenceSelectionnee!: AgenceImmobiliere;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  demandeCertification = this.demandeCertifService.demandeCertification;
  demandeCertifications!: Page<DemandeCertification>
  agencesImmobilieres : AgenceImmobiliere[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  demandeCertificationData: FormData = new  FormData();
  APIEndpoint: string;
  documentJustificatif: any;
  carteCfe: any;
  demandeCertificationForm: any

  constructor(private agenceImmobiliereService: AgenceImmobiliereService, private personneService: PersonneService,
    private demandeCertifService: DemandeCertificationService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute,
    private router: Router, private pageVisibilityService: PageVisibilityService,
    private userInactivityService: UserInactivityService
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
    this.initActivatedRoute();
    this.initDemandeCertificationForm();
    if (this.personneService.estResponsable(this.user.role.code)) {
      this.getAgencesImmobilieresListIfUserActif();
    }
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailDemandeCertif(parseInt(id));
      } else {
        this.listeDemandeCertifications(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  initDemandeCertificationForm(): void {
    this.demandeCertificationForm = new FormGroup({
      agenceImmobiliere: new FormControl('', [Validators.required])
    })
  }

  get agenceImmobiliere() {
    return this.demandeCertificationForm.get('agenceImmobiliere');
  }

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  listeDemandeCertifications(numeroDeLaPage: number, elementsParPage: number) {
    this.demandeCertifService.getDemandesCertifications(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        console.log(response);
        this.demandeCertifications = response;
      }
    );
  }

  // Fonction pour recupérer les agences immobilières (Responsable)
  getAgencesImmobilieresListIfUserActif() {
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee = this.agencesImmobilieres[0];
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeDemandeCertifications(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.documentJustificatif = '';
    this.carteCfe = ''
    this.listeDemandeCertifications(this.numeroDeLaPage, this.elementsParPage);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-certifications']);
  }

  annuler(): void {
    if (this.personneService.estProprietaire(this.user.role.code) || this.personneService.estDemarcheur(this.user.role.code)) {
      this.documentJustificatif = '';
    } else {
      this.demandeCertificationForm.reset();
      this.documentJustificatif = '';
    }
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.demandeCertification = new DemandeCertification();
  }

  telechargerCNI(event: any) {
    const uploadedFile: File = event.files[0];
    this.documentJustificatif = uploadedFile;
    this.messageSuccess = "Le carte d'identité a été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Téléchargement réussi',
      detail: this.messageSuccess
    });
  }

  telechargerCarteCfe(event: any) {
    const uploadedFile: File = event.files[0];
    this.carteCfe = uploadedFile;
    this.messageSuccess = "Le carte cfe a été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Téléchargement réussi',
      detail: this.messageSuccess
    });
  }

  ajouterDemandeCertificationCompte(): void {

    const formValues = {
      personne: this.user
    }

    this.demandeCertificationData.append('demandeCertificationJson', JSON.stringify(formValues))
    this.demandeCertificationData.append('cni', this.documentJustificatif);

    this.demandeCertifService.addDemandeCertificationCompte(this.demandeCertificationData)
    .subscribe(
      (response) => {

        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La demande de certification a été ajouté avec succès!";
          this.messageService.add({
            severity: 'success',
            summary: 'Demande de certification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de votre demande de certification!"
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout de la demande de certification",
            detail: this.messageErreur
          });
          this.afficherFormulaireAjouter();
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }

  ajouterDemandeCertificationAgence(): void{

    const formValues = {
      personne: this.user,
      agenceImmobiliere: this.agenceSelectionnee
    }

    this.demandeCertificationData.append('demandeCertificationJson', JSON.stringify(formValues))
    this.demandeCertificationData.append('cni', this.documentJustificatif);
    this.demandeCertificationData.append('carteCfe', this.carteCfe);

    this.demandeCertifService.addDemandeCertificationAgence(this.demandeCertificationData)
    .subscribe(
      (response) => {

        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La demande de certification a été ajouté avec succès!";
          this.messageService.add({
            severity: 'success',
            summary: 'Demande de certification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de votre demande de certification!"
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout de la demande de certification",
            detail: this.messageErreur
          });
          this.afficherFormulaireAjouter();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  detailDemandeCertif(id: number): void {
    this.demandeCertifService.findById(id).subscribe(
      (response) => {
        this.demandeCertification = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demande-certification/' + id]);
  }

  certifierCompte(idPersonne: number, idDemandeCertif: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir certifier ce compte ?',
      header: "Certification de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCertifService.certifierCompte(idPersonne, idDemandeCertif).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "Le compte du demandeur a été certifié avec succès!";
            this.messageService.add({
              severity: 'success',
              summary: 'Certification de compte confirmé',
              detail: this.messageSuccess
            });
          }
        );
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Certification de compte rejetée',
              detail: 'Vous avez rejeté la certification de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Certification de compte annulée',
              detail: 'Vous avez annulé la la certification de ce compte !'
            });
            break;
        }
      }
    });
  }

  certifierAgence(idAgence: number, idDemandeCertif: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir certifier cette agence ?',
      header: "Certification d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCertifService.certifierAgence(idAgence, idDemandeCertif).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "L'agence immobilière a été certifiée avec succès!";
            this.messageService.add({
              severity: 'success',
              summary: 'Certification de l\'agence confirmé',
              detail: this.messageSuccess
            });
          }
        );
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Certification de l\'agence rejetée',
              detail: 'Vous avez rejeté la certification de cette agence !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Certification de l\'agence annulée',
              detail: 'Vous avez annulé la la certification de cette agence !'
            });
            break;
        }
      }
    });
  }

  telechargerCrteCfe(id: number): void {
    this.demandeCertifService.telechargerCarteCfe(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      }
    )
  }

  telechargerCni(id: number): void {
    this.demandeCertifService.telechargerCni(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      }
    )
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_NOTAIRE':
        roleBasedURL = '/notaire';
        break;
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
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
