import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { AdministrateurService } from 'src/app/services/gestionDesComptes/administrateur.service';
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
export class DashboardComponent implements OnInit {

  _nombreRoles: number = 0;
  _nombreUtilisateurs: number = 0;
  _nombreClients: number = 0;
  _nombreGerants: number = 0;
  _nombreDemarcheurs: number = 0;
  _nombreProprietaires: number = 0;
  _nombreResponsables: number = 0;
  _nombreNotaires: number = 0;
  _nombreAdministrateurs: number = 0;
  _nombreDemandeCertification: number = 0;
  _nombreDemandeCertificationEnAttente: number = 0;
  _nombreDemandeCertificationValidee: number = 0;
  _nombreGerantsParProprietaire: number = 0;

  demandeCertifications : DemandeCertification[] = [];
  user: any;
  connexionReussie: any;

  constructor(
    private personneService: PersonneService,
    private roleService: RoleService,
    private gerantService: GerantService,
    private demarcheurService: DemarcheurService,
    private proprietaireService: ProprietaireService,
    private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private clientService: ClientService,
    private administrateurService: AdministrateurService,
    private notaireService: NotaireService,
    private demandeCertificationService: DemandeCertificationService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  )
  {
    this.demandeCertificationService.findByUser().subscribe(
      (response) => {
        this.demandeCertifications = response;
      }
    )
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.connexionReussie = this.activatedRoute.snapshot.queryParamMap.get('connexionReussie') || '';

    this.nombreRoles();
    this.nombreAdministrateurs();
    this.nombreNotaires();
    this.nombreClients();
    this.nombreProprietaires();
    this.nombreResponsables();
    this.nombreUtilisateurs();
    this.nombreGerants();
    this.nombreDemarcheurs();
    this.nombreDemandeCertification();
    this.nombreDemandeCertificationEnAttente();
    this.nombreDemandeCertificationValidee();
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

  nombreDemandeCertification(): void {
    this.demandeCertificationService.countDemandeCertifications().subscribe(
      (response) => {
        this._nombreDemandeCertification = response;
      }
    );
  }

  nombreDemandeCertificationEnAttente(): void {
    this.demandeCertificationService.countDemandeCertificationsEnAttente().subscribe(
      (response) => {
        this._nombreDemandeCertificationEnAttente = response;
      }
    );
  }

  nombreDemandeCertificationValidee(): void {
    this.demandeCertificationService.countDemandeCertificationsValidees().subscribe(
      (response) => {
        this._nombreDemandeCertificationValidee = response;
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

  nombreProprietaires(): void {
    this.proprietaireService.countProprietaires().subscribe(
      (response) => {
        this._nombreProprietaires = response;
      }
    );
  }

  nombreResponsables(): void {
    this.responsableAgenceImmobiliereService.countResponsablesAgenceImmobiliere().subscribe(
      (response) => {
        this._nombreResponsables = response;
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
        this.messageService.add({ severity: 'success', summary: 'Authentification réussie', detail: 'Vous êtes bel et bien connecté(e).' });
      }
    );
  }
}

