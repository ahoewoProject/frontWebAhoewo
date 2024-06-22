import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Motif } from 'src/app/models/Motif';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { MotifService } from 'src/app/services/motif.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-service-agence',
  templateUrl: './detail-service-agence.component.html',
  styleUrls: ['./detail-service-agence.component.css']
})
export class DetailServiceAgenceComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  motif!: Motif;
  user : any;

  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  serviceForm: any;
  APIEndpoint: string;
  serviceAgenceImmobiliereForm: any;

  constructor(
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService, private activatedRoute: ActivatedRoute,
    private router: Router, private motifService: MotifService, private personneService: PersonneService,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  ) {
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
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
         this.detailServiceAgenceImmobiliere(parsedId);
      }
    });
  }

  voirListe(): void {
    if (this.personneService.estResponsable(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres/services']);
    } else {
      const id = this.serviceAgenceImmobiliere.agenceImmobiliere.id
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/agence-immobiliere/' + id + ' /services']);
    }
  }

  detailMotif(code: string): void {
    this.motifService.findByCode(code).subscribe(
      (response) => {
        this.motif = response;
      }
    );
  }

  detailServiceAgenceImmobiliere(id: number): void {
    this.servicesAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.serviceAgenceImmobiliere = response;
        this.detailMotif(this.serviceAgenceImmobiliere.services.codeService);
      }
    );
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
        roleBasedURL = '/responsable/';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/';
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
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
