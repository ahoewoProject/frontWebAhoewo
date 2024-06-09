import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit, OnDestroy {

  user : any;

  _service = this._servicesService._service;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  serviceForm: any;

  constructor(private _servicesService: ServicesService, private messageService: MessageService,
    private personneService: PersonneService, private router: Router
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initServiceForm()
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/services']);
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
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/services'], { queryParams: { ajoutReussi: true } });
        } else {
          this.messageErreur = "Erreur lors de l'ajout du service !"
          this._service.nomService = response.nomService;
          this._service.description = response.description;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      if (error.status == 409) {
        this.messageErreur = "Un service avec ce nom existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
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
        roleBasedURL = '/responsable';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier';
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
