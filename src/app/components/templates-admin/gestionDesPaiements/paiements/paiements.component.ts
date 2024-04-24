import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';

@Component({
  selector: 'app-paiements',
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css']
})
export class PaiementsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  contratLocation = this.contratLocationService.contratLocation;
  contratVente = this.contratVenteService.contratVente;
  paiements!: Page<Paiement>
  paiement = this.paiementService.paiement;
  user: any;
  paiementReussi: any;

  constructor(private paiementService: PaiementService, private router: Router,
    private activatedRoute: ActivatedRoute, private personneService: PersonneService,
    private messageService: MessageService, private contratVenteService: ContratVenteService,
    private contratLocationService: ContratLocationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.paiementReussi = this.activatedRoute.snapshot.queryParams['paiementReussi'];
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailPaiement(parseInt(id));
      } else {
        this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
      }
    });
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

  retour(): void {
    this.affichage = 1;
    this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiements']);
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

  detailContratVente(id: number) {
    this.contratVenteService.findById(id).subscribe(
      (data) => {
        this.contratVente = data;
      }
    )
  }

  detailContratLocation(id: number) {
    this.contratLocationService.findById(id).subscribe(
      (data) => {
        this.contratLocation = data;
      }
    )
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiements/' + id]);
  }

  afficherCategorie(categorie: string): boolean {
    return categorie == 'Maison' ||
    categorie == 'Villa' ||
    categorie == 'Immeuble' ||
    categorie == 'Appartement' ||
    categorie == 'Chambre salon' ||
    categorie == 'Chambre' ||
    categorie == 'Bureau';
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
