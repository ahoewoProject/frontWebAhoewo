import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './demandes-certifications.component.html',
  styleUrls: ['./demandes-certifications.component.css']
})
export class DemandesCertificationsComponent implements OnInit {

  agenceSelectionne!: AgenceImmobiliere;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  demandeCertification = this.demandeCertifService.demandeCertification;
  demandeCertifications : DemandeCertification[] = [];
  agencesImmobilieres : AgenceImmobiliere[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  demandeCertificationData: FormData = new  FormData();
  APIEndpoint: string;
  documentJustificatif: any;
  carteCfe: any;
  demandeCertificationForm: any

  constructor(
    private agenceImmobiliereService: AgenceImmobiliereService,
    private personneService: PersonneService,
    private demandeCertifService: DemandeCertificationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.listeDemandeCertifications();
    } else if (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listerAgencesImmobilieres();
      this.listeDemandeCertificationParUtilisateur();
    }
    this.initDemandeCertificationForm();
  }

  initDemandeCertificationForm(): void {
    this.demandeCertificationForm = new FormGroup({
      agenceImmobiliere: new FormControl('', [Validators.required])
    })
  }

  get agenceImmobiliere() {
    return this.demandeCertificationForm.get('agenceImmobiliere');
  }

  agenceSelectionnee(event: any) {
    this.agenceSelectionne = event.value;
  }

  listeDemandeCertifications() {
    this.demandeCertifService.getAll().subscribe(
      (response) => {
        console.log(response);
        this.demandeCertifications = response;
      }
    );
  }

  listeDemandeCertificationParUtilisateur() {
    this.demandeCertifService.findByUser().subscribe(
      (response) => {
        console.log(response);
        this.demandeCertifications = response;
      }
    )
  }

  // Fonction pour recupérer les agences immobilières d'un responsable
  listerAgencesImmobilieres() {
    this.agenceImmobiliereService.findAgencesByResponsable().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  // Récupération des demandes de certifications de la page courante
  get demandesCertificationsParPage(): any[] {
    const startIndex = this.pageActuelle;
    const endIndex = startIndex + this.elementsParPage;
    return this.demandeCertifications.slice(startIndex, endIndex);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeDemandeCertifications()
  }

  voirListe(): void {
    if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.listeDemandeCertifications();
    } else if (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.listeDemandeCertificationParUtilisateur();
    }
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.documentJustificatif = '';
    this.carteCfe = ''
  }

  annuler(): void {
    if (this.user.role.code == 'ROLE_PROPRIETAIRE' || this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.affichage = 1;
      this.visibleAddForm = 0;
      this.documentJustificatif = '';
    } else {
      this.demandeCertificationForm.reset();
      this.affichage = 1;
      this.visibleAddForm = 0;
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
    //console.log(uploadedFile)
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
    //console.log(uploadedFile)
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
      agenceImmobiliere: this.agenceSelectionne
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
    this.detailDemandeCertif(id);
    this.affichage = 2;
    this.visibleAddForm = 0;
  }

  certifierCompte(idPersonne: number, idDemandeCertif: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir certifier ce compte ?',
      header: "Certification de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCertifService.certifierCompte(idPersonne, idDemandeCertif).subscribe(
          (response) => {
            //console.log(response);
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
            //console.log(response);
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
}
