import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { AffectationResponsableAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-responsable-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-detail-responsable',
  templateUrl: './detail-responsable.component.html',
  styleUrls: ['./detail-responsable.component.css']
})
export class DetailResponsableComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  affectationResponsableAgence = new AffectationResponsableAgence();
  responsableAgenceImmobiliere = new ResponsableAgenceImmobiliere();
  affectationResponsableAgenceRequest = this.affectationResponsableAgenceService.affectationResponsableAgenceRequest;
  user: any;

  constructor(
    private affectationResponsableAgenceService: AffectationResponsableAgenceService, private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private agenceImmobiliereService: AgenceImmobiliereService, private personneService: PersonneService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initActivatedRoute();
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.initActivatedRoute()
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.initActivatedRoute();
    });
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
        if (this.personneService.estAdmin(this.user.role.code)) {
          this.detailResponsableAgenceImmobiliere(parsedId);
        } else {
          this.detailAffectationResponsableAgence(parsedId);
        }
      }
    });
  }

  voirListe(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/responsables']);
    } else {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsables']);
    }
  }

  detailResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.responsableAgenceImmobiliere = response;
      }
    );
  }

  detailAffectationResponsableAgence(id: number): void {
    this.affectationResponsableAgenceService.detailAffectation(id).subscribe(
      (response) => {
        this.affectationResponsableAgence = response;
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
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
