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
  selector: 'app-update-suivi-entretien',
  templateUrl: './update-suivi-entretien.component.html',
  styleUrls: ['./update-suivi-entretien.component.css']
})
export class UpdateSuiviEntretienComponent implements OnInit, OnDestroy {

  contratLocationSelectionne!: ContratLocation;
  datePrevueSelectionnee!: Date;

  user: any;
  APIEndpoint: string;
  suiviEntretien = this.suiviEntretienService.suiviEntretien;
  suiviEntretienForm: any;
  contratsLocations: ContratLocation[] = [];
  messageSuccess: string | null = null;
  messageErreur: string | null = null;

  constructor(private suiviEntretienService: SuiviEntretienService, private contratLocationService: ContratLocationService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.listeContratsLocations();
    this.initSuiviEntretienForm();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.detailSuiviEntretien(parseInt(id));
      }
    });
  }

  afficherPageModifier(id: number): void {
    this.listeContratsLocations();
    this.suiviEntretienService.findById(id).subscribe(
      (data) => {
        this.suiviEntretien = data;
        this.datePrevueSelectionnee = new Date(this.suiviEntretien.datePrevue)
      }
    )
  }

  listeContratsLocations(): void {
    this.contratLocationService.listContratsLocations().subscribe(
      (response) => {
        this.contratsLocations = response;
        this.contratLocationSelectionne = this.contratsLocations[0];
      }
    )
  }

  detailSuiviEntretien(id: number): void {
    this.suiviEntretienService.findById(id).subscribe(
      (data) => {
        this.suiviEntretien = data;
        this.datePrevueSelectionnee = new Date(this.suiviEntretien.datePrevue)
      }
    )
  }

  contratLocationChoisie(event: any) {
    this.contratLocationSelectionne = event.value;
  }

  initSuiviEntretienForm(): void {
    this.suiviEntretienForm = new FormGroup({
      contratLocation: new FormControl(''),
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      datePrevue: new FormControl('', [Validators.required]),
    })
  }

  get contratLocation() {
    return this.suiviEntretienForm.get('contratLocation')
  }

  get libelle() {
    return this.suiviEntretienForm.get('libelle')
  }

  get description() {
    return this.suiviEntretienForm.get('description')
  }

  get datePrevue() {
    return this.suiviEntretienForm.get('datePrevue')
  }

  voirListe(): void {
    this.formReset();
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/suivis-entretiens']);
  }

  datePrevueChoisie(event: any): void {
    this.datePrevueSelectionnee = event;
  }

  modifierSuiviEntretien(): void{
    this.suiviEntretien.datePrevue =  this.datePrevueSelectionnee;
    this.suiviEntretienService.modifierSuiviEntretien(this.suiviEntretien.id, this.suiviEntretien).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "L'entretien a été modifié avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la modification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Modification échouée',
            detail: this.messageErreur
          })
        }
      }
    )
  }

  formReset(): void {
    this.suiviEntretienForm.reset();
  }

  afficherCategorie(): boolean {
    return this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Maison' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Villa' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Immeuble' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Appartement' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Chambre salon' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Chambre' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Bureau';
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
