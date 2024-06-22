import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { ClientService } from 'src/app/services/gestionDesComptes/client.service';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { DemarcheurService } from 'src/app/services/gestionDesComptes/demarcheur.service';
import { GerantService } from 'src/app/services/gestionDesComptes/gerant.service';
import { NotaireService } from 'src/app/services/gestionDesComptes/notaire.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ProprietaireService } from 'src/app/services/gestionDesComptes/proprietaire.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';
import { RoleService } from 'src/app/services/gestionDesComptes/role.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-gestion-des-comptes',
  templateUrl: './gestion-des-comptes.component.html',
  styleUrls: ['./gestion-des-comptes.component.css']
})
export class GestionDesComptesComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  nbreRole: number = 0;
  nbreUtilisateur: number = 0;
  nbreUtilisateurInactif: number = 0;
  nbreUtilisateurActif: number = 0;
  nbreResponsable: number = 0;
  nbreGerant: number = 0;
  nbreAgentImmobilier: number = 0;
  nbreProprietaire: number = 0;
  nbreNotaire: number = 0;
  nbreClient: number = 0;
  nbreDemarcheur: number = 0;
  nbreGerantActif: number = 0;
  nbreGerantInactif: number = 0;
  nbreAgentImmobilierActif: number = 0;
  nbreAgentImmobilierInactif: number = 0;
  user: any;
  dmndeCertifAttente: number = 0;
  dmndeCertifValidee: number = 0;
  dmndeCertif: number = 0;

  constructor(private personneService: PersonneService, private roleService: RoleService,
    private notaireService: NotaireService, private agentImmobilierService: AgentImmobilierService,
    private clientService: ClientService, private proprietaireService: ProprietaireService,
    private gerantService: GerantService, private demarcheurService: DemarcheurService,
    private responsableService: ResponsableAgenceImmobiliereService, private affectionAgenceService: AffectationAgentAgenceService,
    private demandeCertificationService: DemandeCertificationService, private pageVisibilityService: PageVisibilityService,
    private userInactivityService: UserInactivityService
  ) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.loadData();
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.nombreRoles();
    this.nombreUtilisateurs();
    this.nombreAgentsImmobiliers();
    this.nombreDemarcheurs();
    this.nombreClients();
    this.nombreResponsables();
    this.nombreProprietaires();
    this.nombreGerants();
    this.nombreNotaires();

    this.nombreUtilisateursActifs();
    this.nombreUtilisateursInactifs()

    this.demandesCertifs();
    this.demandesCertifsAttente();
    this.demandeCertifisValidees();
  }

  nombreRoles(): void {
    this.roleService.countRoles().subscribe(
      (response) => {
        this.nbreRole = response;
      }
    );
  }

  nombreUtilisateurs(): void {
    this.personneService.countUsers().subscribe(
      (response) => {
        this.nbreUtilisateur = response;
      }
    );
  }

  nombreUtilisateursActifs(): void {
    this.personneService.getAll().subscribe(
      (response) => {
        this.nbreUtilisateurActif = response.filter(p => p.etatCompte = true).length;
      }
    )
  }

  nombreUtilisateursInactifs(): void {
    this.personneService.getAll().subscribe(
      (response) => {
        this.nbreUtilisateurInactif = response.filter(p => p.etatCompte = false).length;
      }
    )
  }

  nombreResponsables(): void {
    this.responsableService.getAll().subscribe(
      (response) => {
        this.nbreResponsable = response.length;
      }
    )
  }

  nombreNotaires(): void {
    this.notaireService.getAll().subscribe(
      (response) => {
        this.nbreNotaire = response.length;
      }
    )
  }

  nombreAgentsImmobiliers(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.agentImmobilierService.getAll().subscribe(
        (response) => {
          this.nbreAgentImmobilier = response.length;
        }
      )
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.affectionAgenceService.getAgentsOfAgence().subscribe(
        (response) => {
          this.nbreAgentImmobilier = response.length;
          this.nbreAgentImmobilierActif = response.filter(a => a.actif = true).length;
          this.nbreAgentImmobilierInactif = response.filter(a => a.actif = false).length;
        }
      )
    } else {
      this.nbreAgentImmobilier;
    }
  }

  nombreDemarcheurs(): void {
    this.demarcheurService.getAll().subscribe(
      (response) => {
        this.nbreDemarcheur = response.length;
      }
    )
  }

  nombreClients(): void {
    this.clientService.getAll().subscribe(
      (response) => {
        this.nbreClient = response.length;
      }
    )
  }

  nombreProprietaires(): void {
    this.proprietaireService.getAll().subscribe(
      (response) => {
        this.nbreProprietaire = response.length;
      }
    )
  }

  nombreGerants(): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.gerantService.countGerants().subscribe(
        (response) => {
          this.nbreGerant = response;
        }
      )
    } else if (this.personneService.estProprietaire(this.user.role.code)) {
      this.gerantService.countGerantsByProprietaire().subscribe(
        (response) => {
          this.nbreGerant = response;
        }
      )
    } else {
      this.nbreGerant;
    }
  }

  demandesCertifs(): void {
    this.demandeCertificationService.countDemandeCertifications().subscribe(
      (response) => {
        this.dmndeCertif = response;
      }
    );
  }

  demandesCertifsAttente(): void {
    this.demandeCertificationService.countDemandeCertificationsEnAttente().subscribe(
      (response) => {
        this.dmndeCertifAttente = response;
      }
    );
  }

  demandeCertifisValidees(): void {
    this.demandeCertificationService.countDemandeCertificationsValidees().subscribe(
      (response) => {
        this.dmndeCertifValidee = response;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
