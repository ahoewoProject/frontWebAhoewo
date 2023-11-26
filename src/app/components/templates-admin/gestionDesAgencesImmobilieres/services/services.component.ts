import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  _service = this._servicesService._service;
  services : Services[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  APIEndpoint: string;

  constructor(
    private _servicesService: ServicesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personneService: PersonneService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.listeServices();
    this.initServiceForm()
  }

  // Fonction pour recupérer les services
  listeServices() {
    this._servicesService.getAll().subscribe(
      (response) => {
        this.services = response;
      }
    );
  }

  // Récupération des services de la page courante
  get servicesParPage(): any[] {
    return this.services.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeServices()
  }

  voirListe(): void {
    this.listeServices();
    this.serviceForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this._service = new Services();
  }

  afficherFormulaireModifier(id: number): void {
    this.detailService(id);
    this.affichage = 0;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 1;
  }

  detailService(id: number): void {
    console.log(id)
    this._servicesService.findById(id).subscribe(
      (response) => {
        this._service = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailService(id);
    this.affichage = 2;
  }

  initServiceForm(): void {
    this.serviceForm = new FormGroup({
      nomService: new FormControl(this._service.nomService, [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  get nomService() {
    return this.serviceForm.get('nomService');
  }

  get description() {
    return this.serviceForm.get('description');
  }

  ajouterService(): void {
    this._servicesService.addServices(this._service).subscribe(

      (response) => {
        console.log(response)
        if (response.id > 0) {
          this.services.push({
            id: response.id,
            codeService: response.codeService,
            nomService: response.nomService,
            description: response.description,
            etat: response.etat,
            creerPar: 0,
            creerLe: new Date(),
            modifierPar: 0,
            modifierLe: new Date(),
            statut: false
          });
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
          this._service.nomService = response.nomService;
          this._service.description = response.description;
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
        this.messageErreur = "Un service avec ce nom existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierService(id: number): void {
    this._servicesService.updateServices(id, this._service).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le service a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de la modification du service !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
          this.afficherFormulaireModifier(id);
        }
    },
    (error) =>{
      console.log(error)
      if (error.status === 409) {
        this.messageErreur = "Le service avec ce nom existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(id);
      }
    })
  }

  activerService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Activation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.activerService(id).subscribe(response=>{
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

  desactiverService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce service ?',
      header: "Désactivaction d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.desactiverService(id).subscribe(response=>{
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
