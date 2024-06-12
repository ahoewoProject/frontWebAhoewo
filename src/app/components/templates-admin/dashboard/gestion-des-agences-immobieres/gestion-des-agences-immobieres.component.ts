import { Component, OnDestroy, OnInit } from '@angular/core';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AffectationResponsableAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-responsable-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-gestion-des-agences-immobieres',
  templateUrl: './gestion-des-agences-immobieres.component.html',
  styleUrls: ['./gestion-des-agences-immobieres.component.css']
})
export class GestionDesAgencesImmobieresComponent implements OnInit, OnDestroy {

  nbreAgence: number = 0;
  nbreAgenceActif: number = 0;
  nbreAgenceInactif: number = 0;
  user: any;
  nbreService: number = 0;
  nbreServiceActif: number = 0;
  nbreServiceInactif: number = 0;

  constructor(private personneService: PersonneService, private agenceService: AgenceImmobiliereService,
    private agenceResponsableService: AffectationResponsableAgenceService, private agenceAgentImmobilierService: AffectationAgentAgenceService,
    private servicesService: ServicesService, private servicesAgencesService: ServicesAgenceImmobiliereService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.nombreAgences();
    this.nombreAgencesActifs();
    this.nombreAgencesInactifs();

    this.nombreServices();
    this.nombreServicesActifs();
    this.nombreServicesInactifs();
  }

  nombreAgences(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.agenceService.getAll().subscribe(
        (data) => {
          this.nbreAgence = data.length;
        }
      )
    } else if (this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.agenceAgentImmobilierService.getAffectationsAgentAgenceList().subscribe(
        (data) => {
          this.nbreAgence = data.length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.agenceResponsableService.getAffectationsResponsableAgenceList().subscribe(
        (data) => {
          this.nbreAgence = data.length;
        }
      )
    } else {
      this.nbreAgence;
    }
  }

  nombreAgencesActifs(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.agenceService.getAll().subscribe(
        (data) => {
          this.nbreAgenceActif = data.filter(a => a.etatAgence === true).length;
        }
      )
    } else if (this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.agenceAgentImmobilierService.getAffectationsAgentAgenceList().subscribe(
        (data) => {
          this.nbreAgenceActif = data.filter(a => a.actif === true).length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.agenceResponsableService.getAffectationsResponsableAgenceList().subscribe(
        (data) => {
          this.nbreAgenceActif = data.filter(a => a.actif === true).length;
        }
      )
    } else {
      this.nbreAgenceActif;
    }
  }

  nombreAgencesInactifs(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.agenceService.getAll().subscribe(
        (data) => {
          this.nbreAgenceInactif = data.filter(a => a.etatAgence === false).length;
        }
      )
    } else if (this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.agenceAgentImmobilierService.getAffectationsAgentAgenceList().subscribe(
        (data) => {
          this.nbreAgenceInactif = data.filter(a => a.actif === false).length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.agenceResponsableService.getAffectationsResponsableAgenceList().subscribe(
        (data) => {
          this.nbreAgenceInactif = data.filter(a => a.actif === false).length;
        }
      )
    } else {
      this.nbreAgenceInactif;
    }
  }

  nombreServices(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.servicesService.getAll().subscribe(
        (data) => {
          this.nbreService = data.length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.servicesAgencesService.getServicesAgencesList().subscribe(
        (data) => {
          this.nbreService = data.length;
        }
      )
    } else {
      this.nbreService;
    }
  }

  nombreServicesActifs(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.servicesService.getAll().subscribe(
        (data) => {
          this.nbreServiceActif = data.filter(s => s.etat === 1).length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.servicesAgencesService.getServicesAgencesList().subscribe(
        (data) => {
          this.nbreServiceActif = data.filter(s => s.etat === 1).length;
        }
      )
    } else {
      this.nbreServiceActif;
    }
  }

  nombreServicesInactifs(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.servicesService.getAll().subscribe(
        (data) => {
          this.nbreServiceInactif = data.filter(s => s.etat === 2).length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.servicesAgencesService.getServicesAgencesList().subscribe(
        (data) => {
          this.nbreServiceInactif = data.filter(s => s.etat === 2).length;
        }
      )
    } else {
      this.nbreServiceInactif;
    }
  }

  ngOnDestroy(): void {

  }

}
