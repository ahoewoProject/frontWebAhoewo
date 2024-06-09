import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css']
})
export class UpdateServiceComponent implements OnInit, OnDestroy {

  user : any;

  _service = this._servicesService._service;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  serviceForm: any;

  constructor(private _servicesService: ServicesService, private messageService: MessageService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initServiceForm();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
         this.detailService(parsedId);
      }
    });
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/services']);
  }

  detailService(id: number): void {
    this._servicesService.findById(id).subscribe(
      (response) => {
        this._service = response;
      }
    );
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

  modifierService(id: number): void {
    this._servicesService.updateServices(id, this._service).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/services'], { queryParams: { modificationReussie: true } });
        } else {
          this.messageErreur = "Erreur lors de la modification du service !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
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
