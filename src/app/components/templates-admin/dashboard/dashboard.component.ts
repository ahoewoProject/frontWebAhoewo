import { Component, OnInit } from '@angular/core';
import { AdministrateurService } from 'src/app/services/gestionDesComptes/administrateur.service';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { ClientService } from 'src/app/services/gestionDesComptes/client.service';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { DemarcheurService } from 'src/app/services/gestionDesComptes/demarcheur.service';
import { GerantService } from 'src/app/services/gestionDesComptes/gerant.service';
import { NotaireService } from 'src/app/services/gestionDesComptes/notaire.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ProprietaireService } from 'src/app/services/gestionDesComptes/proprietaire.service';
import { RoleService } from 'src/app/services/gestionDesComptes/role.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  _nombreRoles: number = 0;
  _nombreUtilisateurs: number = 0;
  _nombreClients: number = 0;
  _nombreGerants: number = 0;
  _nombreDemarcheurs: number = 0;
  _nombreProprietaires: number = 0;
  _nombreAgentImmobiliers: number = 0;
  _nombreNotaires: number = 0;
  _nombreAdministrateurs: number = 0;
  _nombreDemandeCertifs: number = 0;
  _nombreDemandeCertifsEnAttente: number = 0;
  _nombreDemandeCertifsValidees: number = 0;
  _nombreGerantsParProprietaire: number = 0;

  user: any;

  constructor(
    private personneService: PersonneService,
    private roleService: RoleService,
    private gerantService: GerantService,
    private demandeCertifService: DemandeCertificationService,
    private demarcheurService: DemarcheurService,
    private proprietaireService: ProprietaireService,
    private clientService: ClientService,
    private agentImmobilierService: AgentImmobilierService,
    private administrateurService: AdministrateurService,
    private notaireService: NotaireService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.nombreRoles();
    this.nombreAdministrateurs();
    this.nombreAgentImmobiliers();
    this.nombreNotaires();
    this.nombreClients();
    this.nombreProprietaires();
    this.nombreUtilisateurs();
    this.nombreGerants();
    this.nombreDemarcheurs();
    this.nombreDemandeCertifs();
    this.nombreDemandeCertifsEnAttente();
    this.nombreDemandeCertifsValidees();
    this.nombreGerantsParProprietaire();
    this.detailUser();
  }

  nombreGerantsParProprietaire(): void {
    this.gerantService.countGerantsByProprietaire().subscribe(
      (response) => {
        this._nombreGerantsParProprietaire = response;
      }
    );
  }

  nombreDemandeCertifs(): void {
    this.demandeCertifService.countDemandeCertifications().subscribe(
      (response) => {
        this._nombreDemandeCertifs = response;
      }
    );
  }

  nombreDemandeCertifsEnAttente(): void {
    this.demandeCertifService.countDemandeCertificationsEnAttente().subscribe(
      (response) => {
        this._nombreDemandeCertifsEnAttente = response;
      }
    );
  }

  nombreDemandeCertifsValidees(): void {
    this.demandeCertifService.countDemandeCertificationsValidees().subscribe(
      (response) => {
        this._nombreDemandeCertifsValidees = response;
      }
    );
  }

  nombreRoles(): void {
    this.roleService.countRoles().subscribe(
      (response) => {
        this._nombreRoles = response;
      }
    );
  }

  nombreGerants(): void {
    this.gerantService.countGerants().subscribe(
      (response) => {
        this._nombreGerants = response;
      }
    );
  }

  nombreClients(): void {
    this.clientService.countClients().subscribe(
      (response) => {
        this._nombreClients = response;
      }
    );
  }

  nombreDemarcheurs(): void {
    this.demarcheurService.countDemarcheurs().subscribe(
      (response) => {
        this._nombreDemarcheurs = response;
      }
    );
  }

  nombreAgentImmobiliers(): void {
    this.agentImmobilierService.countAgentImmobiliers().subscribe(
      (response) => {
        this._nombreAgentImmobiliers = response;
      }
    );
  }

  nombreProprietaires(): void {
    this.proprietaireService.countProprietaires().subscribe(
      (response) => {
        this._nombreProprietaires = response;
      }
    );
  }

  nombreNotaires(): void {
    this.notaireService.countNotaires().subscribe(
      (response) => {
        this._nombreNotaires = response;
      }
    );
  }

  nombreAdministrateurs(): void {
    this.administrateurService.countAdministrateurs().subscribe(
      (response) => {
        this._nombreAdministrateurs = response;
      }
    );
  }

  nombreUtilisateurs(): void {
    this.personneService.countUsers().subscribe(
      (response) => {
        this._nombreUtilisateurs = response;
      }
    );
  }

  detailUser(): void {
    this.personneService.findById(this.user.id).subscribe(
      (response) => {
        this.user = response;
      }
    );
  }
}

