import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServiceNonTrouveForm } from 'src/app/models/gestionDesAgencesImmobilieres/ServiceNonTrouveForm';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-agence-immobiliere',
  templateUrl: './services-agence-immobiliere.component.html',
  styleUrls: ['./services-agence-immobiliere.component.css']
})
export class ServicesAgenceImmobiliereComponent implements OnInit, OnDestroy {

  serviceSelectionne!: Services;
  agenceSelectionnee!: AgenceImmobiliere;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  autreService: Services = {
    id: 0,
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: true,
    codeService: "AUTRES",
    nomService: "Autres",
    description: "Description du service Autres",
    etat: 1
  };

  serviceNonTrouveForm: ServiceNonTrouveForm = new ServiceNonTrouveForm();
  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  services: Services[] = [];
  agencesImmobilieres: AgenceImmobiliere[] = [];
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  APIEndpoint: string;
  serviceAgenceImmobiliereForm: any;

  constructor(private _servicesService: ServicesService, private agenceImmobiliereService: AgenceImmobiliereService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private notificationService: NotificationsService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.listerServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    this.initServiceAgenceImmobiliereForm();
    this.listerServicesActifs();
    this.listerAgencesImmobilieres();
  }

  initServiceAgenceImmobiliereForm(): void {
    this.serviceAgenceImmobiliereForm = new FormGroup({
      agenceImmobiliere: new FormControl('', [Validators.required]),
      service: new FormControl('', [Validators.required]),
      nomDuService: new FormControl('', [Validators.required]),
      descriptionDuService: new FormControl('', [Validators.required])
    });
  }

  get service() {
    return this.serviceAgenceImmobiliereForm.get('service');
  }

  get agenceImmobiliere() {
    return this.serviceAgenceImmobiliereForm.get('agenceImmobiliere');
  }

  get nomDuService() {
    return this.serviceAgenceImmobiliereForm.get('nomDuService');
  }

  get descriptionDuService() {
    return this.serviceAgenceImmobiliereForm.get('descriptionDuService');
  }

  // Fonction pour recupérer les services des agences immobilières
  listerServicesAgenceImmobiliere(numeroDeLaPage: number, elementsParPage: number) {
    this.servicesAgenceImmobiliereService.getServicesOfAgencePagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.servicesAgenceImmobiliere = response;
      }
    );
  }

  // Fonction pour recupérer les services
  listerServicesActifs() {
    this._servicesService.getServicesActifs().subscribe(
      (response) => {
        this.services = response;
        this.services.push(this.autreService);
      }
    );
  }

  // Fonction pour recupérer les agences immobilières d'un responsable
  listerAgencesImmobilieres() {
    this.agenceImmobiliereService.findAgencesByResponsable().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  serviceChoisi(event: any) {
    this.serviceSelectionne = event.value;
    if (this.serviceSelectionne.nomService !== 'Autres') {
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.service.setValidators([Validators.required]);
      this.nomDuService.clearValidators();
      this.descriptionDuService.clearValidators();
    } else {
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.service.setValidators([Validators.required]);
      this.nomDuService.setValidators([Validators.required]);
      this.descriptionDuService.setValidators([Validators.required]);
    }
    this.agenceImmobiliere.updateValueAndValidity();
    this.service.updateValueAndValidity();
    this.nomDuService.updateValueAndValidity();
    this.descriptionDuService.updateValueAndValidity();
  }

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  filtrerParAgence(event: any) {
    this.agenceSelectionnee = event.value;
    this.servicesAgenceImmobiliere.content = this.servicesAgenceImmobiliere.content.filter((service) => service.agenceImmobiliere.id == this.agenceSelectionnee.id);
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listerServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listerServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    this.serviceAgenceImmobiliereForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  annuler(): void {
    this.serviceAgenceImmobiliereForm.reset()
    if (this.visibleAddForm == 1) {
      this.affichage = 0;
      this.visibleAddForm = 1;
      this.visibleUpdateForm = 0;
    } else {
      this.affichage = 0;
      this.visibleAddForm = 0;
      this.visibleUpdateForm = 1;
    }
  }

  afficherFormulaireAjouter(): void {
    this.serviceSelectionne = new Services();
    this.agenceSelectionnee = this.agencesImmobilieres[0];
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.serviceAgenceImmobiliere = new ServicesAgenceImmobiliere();
    this.agenceImmobiliere.setValidators([Validators.required]);
    this.service.setValidators([Validators.required]);
    this.nomDuService.clearValidators();
    this.descriptionDuService.clearValidators();
  }

  afficherFormulaireModifier(id: number): void {
    this.detailServiceAgenceImmobiliere(id);
    this.affichage = 0;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 1;
    this.serviceSelectionne = this.serviceAgenceImmobiliere.services;
    this.agenceImmobiliere.setValidators([Validators.required]);
    this.service.setValidators([Validators.required]);
    this.nomDuService.clearValidators();
    this.descriptionDuService.clearValidators();
  }

  detailServiceAgenceImmobiliere(id: number): void {
    this.servicesAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.serviceAgenceImmobiliere = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailServiceAgenceImmobiliere(id);
    this.affichage = 2;
  }

  ajouterServiceAgenceImmobiliere(): void {
    if (this.serviceSelectionne.nomService !== 'Autres') {
      this.serviceAgenceImmobiliere.agenceImmobiliere = this.agenceSelectionnee;
      this.serviceAgenceImmobiliere.services = this.serviceSelectionne;

      this.servicesAgenceImmobiliereService.addServicesAgence(this.serviceAgenceImmobiliere).subscribe(

        (response) => {
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "Le service a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de l'ajout du service !"
            this.afficherFormulaireAjouter();
            this.serviceAgenceImmobiliere.agenceImmobiliere = response.agenceImmobiliere;
            this.serviceAgenceImmobiliere.services = response.services;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        if (error.status == 409) {
          this.messageErreur = "Un service avec ce nom existe déjà dans cette agence !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
      })
    } else {
      this.serviceNonTrouveForm.nomAgence = this.agenceSelectionnee.nomAgence;
      this.serviceNonTrouveForm.nomDuService = this.nomDuService.value;
      this.serviceNonTrouveForm.descriptionDuService = this.descriptionDuService.value;
      this.servicesAgenceImmobiliereService.demandeAjoutNouveauService(this.serviceNonTrouveForm).subscribe(

      (response) => {
        this.voirListe();
        this.messageSuccess = "Votre demande a été envoyée avec succès.\nNotre équipe s'engage à vous fournir un retour dans les plus brefs délais.";
        this.messageService.add({
          severity: 'success',
          summary: 'Demande envoyée',
          detail: this.messageSuccess
        });

      },
      (error) =>{
        this.messageErreur = "Erreur lors de l'envoi de la demande !";
        this.messageService.add({
          severity: 'warn',
          summary: "Demande non envoyée",
          detail: this.messageErreur
        });
      })
    }
  }

  modifierServiceAgenceImmobiliere(id: number): void {
    if (this.serviceSelectionne.nomService !== 'Autres') {
      this.serviceAgenceImmobiliere.agenceImmobiliere = this.agenceSelectionnee;
      this.serviceAgenceImmobiliere.services = this.serviceSelectionne;

      this.servicesAgenceImmobiliereService.updateServicesAgence(id, this.serviceAgenceImmobiliere).subscribe(

        (response) => {
          //console.log(error)(response)
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "Le service a été modifié avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de la modification du service !"
            this.afficherFormulaireModifier(id);
            this.serviceAgenceImmobiliere.agenceImmobiliere = response.agenceImmobiliere;
            this.serviceAgenceImmobiliere.services = response.services;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur de modification",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        //console.log(error)(error)
        if (error.status == 409) {
          this.messageErreur = "Un service avec ce nom existe déjà dans cette agence !";
          this.messageService.add({
            severity: 'warn',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      })
    } else {
      this.serviceNonTrouveForm.nomAgence = this.agenceSelectionnee.nomAgence;
      this.serviceNonTrouveForm.nomDuService = this.nomDuService.value;
      this.serviceNonTrouveForm.descriptionDuService = this.descriptionDuService.value;
      this.servicesAgenceImmobiliereService.demandeAjoutNouveauService(this.serviceNonTrouveForm).subscribe(

      (response) => {
        //console.log(response)
        this.voirListe();
        this.messageSuccess = "Votre demande a été envoyée avec succès.\nNotre équipe s'engage à vous fournir un retour dans les plus brefs délais.";
        this.messageService.add({
          severity: 'success',
          summary: 'Demande envoyée',
          detail: this.messageSuccess
        });
      },
      (error) =>{
        //console.log(error)
        this.messageErreur = "Erreur lors de l'envoi de la demande !";
        this.messageService.add({
          severity: 'warn',
          summary: "Demande non envoyée",
          detail: this.messageErreur
        });
      })
    }

  }

  activerServiceAgenceImmobiliere(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Activation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesAgenceImmobiliereService.activerServiceAgence(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le service a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du service confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du service rejetée',
              detail: "Vous avez rejeté l'activation de ce service !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du service annulée',
              detail: "Vous avez annulé l'activation de ce service !"
            });
            break;
        }
      }
    });
  }

  desactiverServiceAgenceImmobiliere(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce service ?',
      header: "Désactivaction d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesAgenceImmobiliereService.desactiverServiceAgence(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le service a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation du service confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du service rejetée',
              detail: "Vous avez rejeté la désactivation de ce service !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du service annulée',
              detail: "Vous avez annulé la désactivation de ce service !"
            });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {

  }
}
