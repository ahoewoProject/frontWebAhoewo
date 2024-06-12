import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';

@Component({
  selector: 'app-detail-planification-paiement',
  templateUrl: './detail-planification-paiement.component.html',
  styleUrls: ['./detail-planification-paiement.component.css']
})
export class DetailPlanificationPaiementComponent {

  planificationPaiement = this.planificationPaiementService.planificationPaiement;
  contratLocation = this.contratLocationService.contratLocation;
  contratVente = this.contratVenteService.contratVente;

  user: any;
  paiementAnnule: any

  constructor(
    private planificationPaiementService: PlanificationPaiementService, private contratVenteService: ContratVenteService,
    private contratLocationService: ContratLocationService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private messageService: MessageService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.paiementAnnule = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.detailPlanificationPaiement(parseInt(id));
      }
    });
  }

  listePlanificationsPaiements(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planifications-paiements']);
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
        if (this.paiementAnnule) {
          this.messageService.add({ severity: 'error', summary: 'Paiement annulé', detail: 'Votre paiement a été annulé.' });
        }
      }
    )
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contratLocation = response;
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contratVente = response;
      }
    )
  }

  afficherPagePaiement(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planification-paiement/effectuer-paiement/' + id]);
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

  }
}
