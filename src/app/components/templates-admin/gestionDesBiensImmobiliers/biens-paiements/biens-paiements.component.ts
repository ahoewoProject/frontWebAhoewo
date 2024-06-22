import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-biens-paiements',
  templateUrl: './biens-paiements.component.html',
  styleUrls: ['./biens-paiements.component.css']
})
export class BiensPaiementsComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  recherche: string = '';
  affichage: number = 1;
  elementsParPage =  5;
  numeroDeLaPage = 0;

  paiement = this.paiementService.paiement;
  paiements!: Page<Paiement>;
  codeContrat: any;
  contrat: any;
  user: any;
  activeIndex: number = 0;

  constructor(private paiementService: PaiementService, private activatedRoute: ActivatedRoute,
    private router: Router, private contratLocationService: ContratLocationService,
    private contratVenteService: ContratVenteService, private personneService: PersonneService,
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
        this.initActivatedRoute();
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.initActivatedRoute();
    });
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const codeContrat = params.get('codeContrat');
      const idPaiement = params.get('idPaiement');

      switch (true) {
        case codeContrat !== null:
          this.codeContrat = codeContrat!;
          this.afficherListePaiements(this.codeContrat, this.numeroDeLaPage, this.elementsParPage)
          break;
        case idPaiement !== null:
          const idPaiementString = idPaiement!;
          this.afficherPageDetailPaiement(parseInt(idPaiementString, 10));
          break;
        default:
          // Gérer le cas où aucun paramètre pertinent n'est défini
          // Peut-être rediriger vers une page d'erreur ou afficher un message approprié
          break;
      }
    });
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (data) => {
        this.contrat = data;
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (data) => {
        this.contrat = data;
      }
    )
  }

  detailPaiement(id: number): void {
    this.paiementService.findById(id).subscribe(
      (response) => {
        this.paiement = response;
        if (this.paiement.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.paiement.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.paiement.planificationPaiement.contrat.id);
        }
      }
    )
  }

  afficherPageDetailPaiement(id: number): void {
    this.detailPaiement(id);
    this.affichage = 2;
  }

  voirPageDetailPaiement(id: number): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/paiement/', id]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/paiement/', id]);
    }
  }

  detailContratByCodeContrat(codeContrat: string): void {
    this.contratLocationService.findByCodeContrat(codeContrat).subscribe(
      (response) => {
        if (response) {
          this.contrat = response;
          this.activeIndex = 0;
        } else {
          this.contratVenteService.findByCodeContrat(codeContrat).subscribe(
            (responseVente) => {
              this.contrat = responseVente;
              this.activeIndex = 1;
            }
          );
        }
      }
    )
  }

  listePaiementsByCodeContrat(codeContrat: string, numeroDeLaPagePaiement: number, elementsParPagePaiement: number): void {
    this.detailContratByCodeContrat(codeContrat);
    this.paiementService.getPaiementsByCodeContrat(codeContrat, numeroDeLaPagePaiement, elementsParPagePaiement).subscribe(
      (response) => {
        this.paiements = response;
      }
    )
  }

  afficherListePaiements(codeContrat: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.listePaiementsByCodeContrat(codeContrat, numeroDeLaPage, elementsParPage);
    this.affichage = 1;
  }

  voirListePaiements(codeContrat: string): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/paiements/', codeContrat]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/paiements/', codeContrat]);
    }
  }

  paginationPaiement(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePaiementsByCodeContrat(this.codeContrat, this.numeroDeLaPage, this.elementsParPage);
  }

  voirListeContratsBien(codeBien: string, codeContrat: string): void {
    this.detailContratByCodeContrat(codeContrat)
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/', codeBien], { queryParams: { activeIndex: this.activeIndex }});
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/', codeBien], { queryParams: { activeIndex: this.activeIndex }});
    }
  }

  telechargerFichePaiement(id: number): void {
    this.paiementService.telechargerFichePaiement(id).subscribe(
      (response) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
      }
    )
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
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
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
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
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
