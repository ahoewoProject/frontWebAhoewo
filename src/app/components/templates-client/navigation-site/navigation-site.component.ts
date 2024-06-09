import { Component, OnInit } from '@angular/core';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation-site',
  templateUrl: './navigation-site.component.html',
  styleUrls: ['./navigation-site.component.css']
})
export class NavigationSiteComponent implements OnInit {

  user: any;
  activeLink: any;

  constructor(
    private personneService: PersonneService, private router: Router,
    private route: ActivatedRoute
  ) 
  {

  }

  ngOnInit(): void {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    if (utilisateurConnecte) {
      this.user = JSON.parse(utilisateurConnecte);
    }
  }

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
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
}
