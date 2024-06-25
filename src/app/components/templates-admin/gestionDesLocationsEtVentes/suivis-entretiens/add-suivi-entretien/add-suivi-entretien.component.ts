import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { SuiviEntretienService } from 'src/app/services/gestionDesLocationsEtVentes/suivi-entretien.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-suivi-entretien',
  templateUrl: './add-suivi-entretien.component.html',
  styleUrls: ['./add-suivi-entretien.component.css']
})
export class AddSuiviEntretienComponent implements OnInit, OnDestroy {

  contratLocationSelectionne!: ContratLocation;
  datePrevueSelectionnee!: Date;

  user: any;
  APIEndpoint: string;
  suiviEntretien = this.suiviEntretienService.suiviEntretien;
  messageSuccess: string | null = null;
  messageErreur: string | null = null;
  suiviEntretienReussi: any;
  suiviEntretienForm: any;

  constructor(private suiviEntretienService: SuiviEntretienService, private contratLocationService: ContratLocationService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initSuiviEntretienForm();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idContrat = params.get('idContrat');

      if (idContrat) {
        this.detailContratLocation(parseInt(idContrat));
      }
    });
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (data) => {
        console.log(data)
        this.contratLocationSelectionne = data;
      }
    )
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

  datePrevueChoisie(event: any): void {
    this.datePrevueSelectionnee = event;
  }

  formReset(): void {
    this.suiviEntretienForm.reset();
  }

  ajouterSuiviEntretien(): void {
    this.suiviEntretien.contratLocation = this.contratLocationSelectionne;
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

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats']);
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
