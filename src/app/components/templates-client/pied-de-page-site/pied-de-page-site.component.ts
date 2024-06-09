import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-pied-de-page-site',
  templateUrl: './pied-de-page-site.component.html',
  styleUrls: ['./pied-de-page-site.component.css']
})
export class PiedDePageSiteComponent implements OnInit, OnDestroy {

  user: any;
  constructor(private personneService: PersonneService) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    if (utilisateurConnecte) {
      this.user = JSON.parse(utilisateurConnecte);
    }
  }

  ngOnInit(): void {

  }

  redirectToDashboard(): string {
    let dashboardUrl = '';
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      dashboardUrl = '/admin/dashboard';
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      dashboardUrl = '/notaire/dashboard';
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      dashboardUrl = '/responsable/dashboard';
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      dashboardUrl = '/proprietaire/dashboard';
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      dashboardUrl = '/demarcheur/dashboard';
    } else if (this.user.role.code == 'ROLE_GERANT') {
      dashboardUrl = '/gerant/dashboard';
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      dashboardUrl = '/agent-immobilier/dashboard';
    } else if (this.user.role.code == 'ROLE_CLIENT') {
      dashboardUrl = '/client/dashboard';
    }

    return dashboardUrl;
  }

  ngOnDestroy(): void {

  }

}
