import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { AffectationResponsableAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-responsable-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';

@Component({
  selector: 'app-detail-responsable',
  templateUrl: './detail-responsable.component.html',
  styleUrls: ['./detail-responsable.component.css']
})
export class DetailResponsableComponent implements OnInit, OnDestroy {

  affectationResponsableAgence = new AffectationResponsableAgence();
  responsableAgenceImmobiliere = new ResponsableAgenceImmobiliere();
  affectationResponsableAgenceRequest = this.affectationResponsableAgenceService.affectationResponsableAgenceRequest;
  user: any;

  constructor(
    private affectationResponsableAgenceService: AffectationResponsableAgenceService, private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private agenceImmobiliereService: AgenceImmobiliereService, private personneService: PersonneService,
    private activatedRoute: ActivatedRoute, private router: Router
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initActivatedRoute()
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
        if (this.personneService.estAdmin(this.user.role.code)) {
          this.detailResponsableAgenceImmobiliere(parsedId);
        } else {
          this.detailAffectationResponsableAgence(parsedId);
        }
      }
    });
  }

  voirListe(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/responsables']);
    } else {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsables']);
    }
  }

  detailResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.responsableAgenceImmobiliere = response;
      }
    );
  }

  detailAffectationResponsableAgence(id: number): void {
    this.affectationResponsableAgenceService.detailAffectation(id).subscribe(
      (response) => {
        this.affectationResponsableAgence = response;
      }
    );
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
