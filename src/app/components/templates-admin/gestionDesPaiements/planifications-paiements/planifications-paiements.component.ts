import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-planifications-paiements',
  templateUrl: './planifications-paiements.component.html',
  styleUrls: ['./planifications-paiements.component.css']
})
export class PlanificationsPaiementsComponent implements OnInit, OnDestroy {

  // url = 'https://sandbox-api.fedapay.com/v1';
  // token = 'sk_sandbox_CilfCtbWmwtBJt5mJqGGS2l7';

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  recherche: string = '';
  elementsParPage = 5;
  numeroDeLaPage = 0;

  planificationsPaiements!: Page<PlanificationPaiement>;
  planificationsPaiementsList: PlanificationPaiement[] = [];

  messageSuccess: string | null = null;
  messageErreur: string | null = null;
  user: any;

  planificationPaiementReussie: any;
  preuve: any;
  preuveUrl: any;
  paiementData: FormData = new  FormData();
  paiementAnnule: any

  constructor(private planificationPaiementService: PlanificationPaiementService,
    private router: Router, private personneService: PersonneService,
    private messageService: MessageService, private userInactivityService: UserInactivityService,
    private pageVisibilityService: PageVisibilityService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
    });
  }

  listePlanificationsPaiements(numeroDeLaPage: number, elementsParPage: number): void {
    this.planificationPaiementService.getPlanificationsPaiements(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.planificationsPaiements = response;
        if (this.planificationPaiementReussie) {
          this.messageService.add({ severity: 'success', summary: 'Planification de paiement réussi', detail: 'Le planification paiement a été enregistré avec succès.' });
        }
      }
    )
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePlanificationsPaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  afficherPageDetailPlanification(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planification-paiement/' + id]);
  }

  afficherCategorie(designation: string): boolean {
    return designation == 'Maison' ||
    designation == 'Villa' ||
    designation == 'Immeuble' ||
    designation == 'Appartement' ||
    designation == 'Chambre salon' ||
    designation == 'Chambre' ||
    designation == 'Bureau';
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
