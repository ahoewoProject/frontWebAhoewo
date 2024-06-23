import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { SuiviEntretienService } from 'src/app/services/gestionDesLocationsEtVentes/suivi-entretien.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-suivi-entretien',
  templateUrl: './detail-suivi-entretien.component.html',
  styleUrls: ['./detail-suivi-entretien.component.css']
})
export class DetailSuiviEntretienComponent implements OnInit, OnDestroy {

  user: any;
  APIEndpoint: string;
  suiviEntretien = this.suiviEntretienService.suiviEntretien;

  constructor(private suiviEntretienService: SuiviEntretienService, private contratLocationService: ContratLocationService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
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

  detailSuiviEntretien(id: number): void {
    this.suiviEntretienService.findById(id).subscribe(
      (data) => {
        this.suiviEntretien = data;
      }
    )
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/suivis-entretiens']);
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
