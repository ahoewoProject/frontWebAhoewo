import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServiceNonTrouveForm } from 'src/app/models/gestionDesAgencesImmobilieres/ServiceNonTrouveForm';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-add-service-agence',
  templateUrl: './add-service-agence.component.html',
  styleUrls: ['./add-service-agence.component.css']
})
export class AddServiceAgenceComponent implements OnInit, OnDestroy {

  serviceSelectionne!: Services;
  agenceSelectionnee!: AgenceImmobiliere;
  user : any;

  autreService: Services = {
    id: 0,
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    annulerPar: 0,
    annulerLe: new Date(),
    refuserPar: 0,
    refuserLe: new Date(),
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
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  serviceForm: any;
  serviceAgenceImmobiliereForm: any;

  constructor(private _servicesService: ServicesService, private agenceImmobiliereService: AgenceImmobiliereService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService, private messageService: MessageService,
    private router: Router, private personneService: PersonneService
  ) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.getServicesActifs();
    this.getAgencesImmobilieresListIfUserActif();
    this.initServiceAgenceImmobiliereForm();
    this.afficherFormulaireAjouter();
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/services']);
  }

  // Fonction pour recupérer les services
  getServicesActifs() {
    this._servicesService.getServicesActifs().subscribe(
      (response) => {
        this.services = response;
        this.services.push(this.autreService);
        this.serviceSelectionne = this.services[0];
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

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
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

  afficherFormulaireAjouter(): void {
    this.serviceAgenceImmobiliere = new ServicesAgenceImmobiliere();
    this.agenceImmobiliere.setValidators([Validators.required]);
    this.service.setValidators([Validators.required]);
    this.nomDuService.clearValidators();
    this.descriptionDuService.clearValidators();
  }

  ajouterServiceAgenceImmobiliere(): void {
    if (this.serviceSelectionne.nomService !== 'Autres') {
      this.serviceAgenceImmobiliere.agenceImmobiliere = this.agenceSelectionnee;
      this.serviceAgenceImmobiliere.services = this.serviceSelectionne;

      this.servicesAgenceImmobiliereService.addServicesAgence(this.serviceAgenceImmobiliere).subscribe(
        (response) => {
          if (response.id > 0) {
            this.router.navigate([this.navigateURLBYUSER(this.user) + '/services'], { queryParams: { ajoutReussi: true } });
          } else {
            this.messageErreur = "Erreur lors de l'ajout du service !"
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
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/services'], { queryParams: { demandeReussie: true } });
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
