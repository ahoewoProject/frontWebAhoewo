import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/interfaces/Page';
import { PlanificationPaiement } from 'src/app/models/gestionDesPaiements/PlanificationPaiement';
import { Motif } from 'src/app/models/Motif';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';

@Component({
  selector: 'app-biens-planifications-paiements',
  templateUrl: './biens-planifications-paiements.component.html',
  styleUrls: ['./biens-planifications-paiements.component.css']
})
export class BiensPlanificationsPaiementsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage: number = 1;

  elementsParPage = 5;
  numeroDeLaPage = 0;

  listMotifs: Motif[] = [];
  planificationsPaiements!: Page<PlanificationPaiement>;
  planificationPaiement: any;
  codeContrat: any;
  contrat: any;
  user: any;
  activeIndex: number = 0;
  paiement = this.paiementService.paiement;

  constructor(private planificationPaiementService: PlanificationPaiementService, private contratLocationService: ContratLocationService,
    private contratVenteService: ContratVenteService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private paiementService: PaiementService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const codeContrat = params.get('codeContrat');
      const idPlanificationPaiement = params.get('idPlanificationPaiement');

      switch (true) {
        case codeContrat !== null:
          this.codeContrat = codeContrat!;
          this.afficherListePlanificationsPaiement(this.codeContrat, this.numeroDeLaPage, this.elementsParPage)
          break;
        case idPlanificationPaiement !== null:
          const idPlanificationPaiementString = idPlanificationPaiement!;
          this.afficherPageDetailPlanificationPaiement(parseInt(idPlanificationPaiementString, 10));
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
      (response) => {
        this.contrat = response;
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contrat = response;
      }
    )
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

  afficherListePlanificationsPaiement(codeContrat: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.listePlanificationsPaiementParCodeContrat(codeContrat, numeroDeLaPage, elementsParPage);
    this.affichage = 1;
  }

  listePlanificationsPaiementParCodeContrat(codeContrat: string, numeroDeLaPagePlanification: number, elementsParPagePlanification: number) {
    this.detailContratByCodeContrat(codeContrat);
    this.planificationPaiementService.getPlanificationsPaiementsByCodeContrat(codeContrat, numeroDeLaPagePlanification, elementsParPagePlanification).subscribe(
      (response) => {
        this.planificationsPaiements = response;
      }
    )
  }

  paginationPlanificationPaiement(event: any) {
    this.elementsParPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePlanificationsPaiementParCodeContrat(this.codeContrat, this.numeroDeLaPage, this.elementsParPage);
  }

  voirListePlanificationsPaiements(codeContrat: string): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/planifications-paiements/', codeContrat]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/planifications-paiements/', codeContrat]);
    }
  }

  voirListeContratsBien(codeBien: string, codeContrat: string): void {
    this.detailContratByCodeContrat(codeContrat);
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/', codeBien], { queryParams: { activeIndex: this.activeIndex }});
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/', codeBien], { queryParams: { activeIndex: this.activeIndex }});
    }
  }

  detailPlanificationPaiement(id: number): void {
    this.planificationPaiementService.findById(id).subscribe(
      (response) => {
        this.planificationPaiement = response;
        if (this.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.planificationPaiement.contrat.id);
        }
      }
    )
  }

  afficherPageDetailPlanificationPaiement(id: number): void {
    this.detailPlanificationPaiement(id);
    this.affichage = 2;
  }

  voirPageDetailPlanificationPaiement(id: number): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/planification-paiement/', id]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/planification-paiement/', id]);
    }
  }

  detailPaiementParCodePlanification(codePlanification: string): void {
    this.paiementService.findByCodePlanification(codePlanification).subscribe(
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

  afficherPagePaiement(codePlanification: string): void {
    this.detailPaiementParCodePlanification(codePlanification);
    this.affichage = 3;
  }

  retourListePlanificationsPaiements(codeContrat: string): void {
    this.afficherListePlanificationsPaiement(codeContrat, this.numeroDeLaPage, this.elementsParPage)
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

  }
}
