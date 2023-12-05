import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-agence-immobiliere',
  templateUrl: './services-agence-immobiliere.component.html',
  styleUrls: ['./services-agence-immobiliere.component.css']
})
export class ServicesAgenceImmobiliereComponent implements OnInit {

  serviceSelectionne!: Services;
  agenceSelectionnee!: AgenceImmobiliere;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  services : Services[] = [];
  agencesImmobilieres: AgenceImmobiliere[] = [];
  servicesAgenceImmobiliere: ServicesAgenceImmobiliere[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  APIEndpoint: string;
  serviceAgenceImmobiliereForm: any;

  constructor(
    private _servicesService: ServicesService,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.listerServicesAgenceImmobiliere();
    this.initServiceAgenceImmobiliereForm();
    this.listerServices();
    this.listerAgencesImmobilieres();
  }

  initServiceAgenceImmobiliereForm(): void {
    this.serviceAgenceImmobiliereForm = new FormGroup({
      service: new FormControl('', [Validators.required]),
      agenceImmobiliere: new FormControl('', [Validators.required])
    });
  }

  get service() {
    return this.serviceAgenceImmobiliereForm.get('service');
  }

  get agenceImmobiliere() {
    return this.serviceAgenceImmobiliereForm.get('agenceImmobiliere');
  }

  // Fonction pour recupérer les services des agences immobilières
  listerServicesAgenceImmobiliere() {
    this.servicesAgenceImmobiliereService.getServicesOfAgence().subscribe(
      (response) => {
        this.servicesAgenceImmobiliere = response;
      }
    );
  }

  // Fonction pour recupérer les services
  listerServices() {
    this._servicesService.getAll().subscribe(
      (response) => {
        this.services = response;
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
  }

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  // Récupération des services de la page courante
  get servicesAgenceImmobiliereParPage(): any[] {
    return this.servicesAgenceImmobiliere.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listerServicesAgenceImmobiliere();
  }

  voirListe(): void {
    this.listerServicesAgenceImmobiliere();
    this.serviceAgenceImmobiliereForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.serviceAgenceImmobiliere = new ServicesAgenceImmobiliere();
  }

  afficherFormulaireModifier(id: number): void {
    this.detailServiceAgenceImmobiliere(id);
    this.affichage = 0;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 1;
  }

  detailServiceAgenceImmobiliere(id: number): void {
    console.log(id)
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
    this.serviceAgenceImmobiliere.agenceImmobiliere = this.agenceSelectionnee;
    this.serviceAgenceImmobiliere.services = this.serviceSelectionne;

    this.servicesAgenceImmobiliereService.addServicesAgence(this.serviceAgenceImmobiliere).subscribe(

      (response) => {
        console.log(response)
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
      console.log(error)
      if (error.status === 409) {
        this.messageErreur = "Un service avec ce nom existe déjà dans cette agence !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierServiceAgenceImmobiliere(id: number): void {
    this.serviceAgenceImmobiliere.agenceImmobiliere = this.agenceSelectionnee;
    this.serviceAgenceImmobiliere.services = this.serviceSelectionne;

    this.servicesAgenceImmobiliereService.updateServicesAgence(id, this.serviceAgenceImmobiliere).subscribe(

      (response) => {
        console.log(response)
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
      console.log(error)
      if (error.status === 409) {
        this.messageErreur = "Un service avec ce nom existe déjà dans cette agence !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      }
    })
  }

  activerServiceAgenceImmobiliere(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Activation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesAgenceImmobiliereService.activerServiceAgence(id).subscribe(response=>{
          console.log(response);
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
          console.log(response);
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

}
