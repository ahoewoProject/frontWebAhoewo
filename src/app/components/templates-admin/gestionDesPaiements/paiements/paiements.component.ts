import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paiements',
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css']
})
export class PaiementsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  elementsParPage = 5;
  numeroDeLaPage = 0;

  paiements!: Page<Paiement>
  messageSuccess: string | null = null;
  user: any;
  paiementReussi: any;
  APIEndpoint: any;

  constructor(private paiementService: PaiementService, private router: Router,
    private activatedRoute: ActivatedRoute, private personneService: PersonneService,
    private messageService: MessageService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.paiementReussi = this.activatedRoute.snapshot.queryParams['paiementReussi'];
    this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  listePaiements(numeroDeLaPage: number, elementsParPage: number): void {
    this.paiementService.getPaiements(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.paiements = response;
        if (this.paiementReussi) {
          this.messageService.add({ severity: 'success', summary: 'Paiement réussi', detail: 'Le paiement a été effectué avec succès.' });
        }
      }
    )
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiement/' + id]);
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
