import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationAgentAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgence';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-agence-immobiliere',
  templateUrl: './detail-agence-immobiliere.component.html',
  styleUrls: ['./detail-agence-immobiliere.component.css']
})
export class DetailAgenceImmobiliereComponent implements OnInit, OnDestroy {

  APIEndpoint: string;
  user: any;
  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  affectationAgentAgence: AffectationAgentAgence = new AffectationAgentAgence();
  constructor(
    private agenceImmobiliereService: AgenceImmobiliereService, private affectationAgentAgenceService: AffectationAgentAgenceService,
    private personneService: PersonneService, private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
        if (this.personneService.estAdmin(this.user.role.code) || this.personneService.estResponsable(this.user.role.code)) {
          this.detailAgenceImmobiliere(parsedId);
        } else {
          this.detailAffectationAgentAgence(parsedId);
        }
      }
    });
  }

  detailAgenceImmobiliere(id: number): void {
    this.agenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.agenceImmobiliere = response;
      }
    );
  }

  detailAffectationAgentAgence(id: number): void {
    this.affectationAgentAgenceService.findById(id).subscribe(
      (response) => {
        this.affectationAgentAgence = response;
      }
    )
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres']);
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
        roleBasedURL = '/responsable';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier';
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
