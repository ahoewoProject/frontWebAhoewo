import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationAgentAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgence';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-detail-agent-immobilier',
  templateUrl: './detail-agent-immobilier.component.html',
  styleUrls: ['./detail-agent-immobilier.component.css']
})
export class DetailAgentImmobilierComponent implements OnInit, OnDestroy {

  affecationAgentAgence: AffectationAgentAgence = new AffectationAgentAgence();
  agentImmobilier: AgentImmobilier = new AgentImmobilier();
  user: any;

  constructor(
    private affectationAgentAgenceService: AffectationAgentAgenceService, private agentImmobilierService: AgentImmobilierService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router
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
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
        if (this.personneService.estAdmin(this.user.role.code)) {
          this.detailAgentImmobilier(parsedId);
        } else {
          this.detailAffectationAgentAgence(parsedId);
        }
      }
    });
  }

  detailAffectationAgentAgence(id: number): void {
    this.affectationAgentAgenceService.findById(id).subscribe(
      (response) => {
        this.affecationAgentAgence = response;
      }
    );
  }

  detailAgentImmobilier(id: number): void {
    this.agentImmobilierService.findById(id).subscribe(
      (data) => {
        console.log(data)
        this.agentImmobilier = data;
      }
    )
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agents-immobiliers']);
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
