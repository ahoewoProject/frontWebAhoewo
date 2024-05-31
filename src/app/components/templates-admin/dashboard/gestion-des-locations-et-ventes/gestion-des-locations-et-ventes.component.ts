import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { DemandeAchatService } from 'src/app/services/gestionDesLocationsEtVentes/demande-achat.service';
import { DemandeLocationService } from 'src/app/services/gestionDesLocationsEtVentes/demande-location.service';
import { DemandeVisiteService } from 'src/app/services/gestionDesLocationsEtVentes/demande-visite.service';
import { SuiviEntretienService } from 'src/app/services/gestionDesLocationsEtVentes/suivi-entretien.service';

@Component({
  selector: 'app-gestion-des-locations-et-ventes',
  templateUrl: './gestion-des-locations-et-ventes.component.html',
  styleUrls: ['./gestion-des-locations-et-ventes.component.css']
})
export class GestionDesLocationsEtVentesComponent implements OnInit, OnDestroy {

  nbreDemandeVisite: number = 0; nbreDemandeLocation: number = 0;
  nbreDemandeAchat: number = 0;

  nbreDemandeVisiteAttente: number = 0; nbreDemandeVisiteRefusee: number = 0;
  nbreDemandeVisiteValidee: number = 0; nbreDemandeVisiteAnnulee: number = 0;

  nbreDemandeLocationAttente: number = 0; nbreDemandeLocationRefusee: number = 0;
  nbreDemandeLocationValidee: number = 0; nbreDemandeLocationAnnulee: number = 0;

  nbreDemandeAchatAttente: number = 0; nbreDemandeAchatRefusee: number = 0;
  nbreDemandeAchatValidee: number = 0; nbreDemandeAchatAnnulee: number = 0;

  nbreContratLocation: number = 0; nbreContratVente: number = 0;

  nbreContratVenteAttente: number = 0; nbreContratVenteAnnule: number = 0;
  nbreContratVenteRefuse: number = 0; nbreContratVenteValide: number = 0;
  nbreContratVenteConfirme: number = 0;

  nbreContratLocationValide: number = 0; nbreContratLocationAnnule: number = 0;
  nbreContratLocationRefuse: number = 0; nbreContratLocationAttente: number = 0;
  nbreContratLocationCours: number = 0; nbreContratLocationTermine: number = 0;

  nbreSuiviEntretien: number = 0; nbreSuiviEntretienAttente: number = 0;
  nbreSuiviEntretienDebute: number = 0; nbreSuiviEntretienTermine: number = 0;

  dataDemandeVisite: any; optionsDemandeVisite: any;
  dataDemandeLocation: any; optionsDemandeLocation: any;
  dataDemandeAchat: any; optionsDemandeAchat: any;
  dataContratLocation: any; optionsContratLocation:any;
  dataContratVente: any; optionsContratVente: any;
  dataSuiviEntretien: any; optionsSuiviEntretien: any;

  constructor(private demandeVisiteService: DemandeVisiteService, private demandeLocationService: DemandeLocationService,
    private demandeAchatService: DemandeAchatService, private contratLocationService: ContratLocationService,
    private contratVenteService: ContratVenteService, private suiviEntretienService: SuiviEntretienService
  ) {

  }

  ngOnInit(): void {
    this.nombreDemandeVisite();
    this.nombreDemandeLocation();
    this.nombreDemandeAchat();

    this.nombreContratLocation();
    this.nombreContratVente();
    this.nombreSuiviEntretien();

    this.initChartJsDemandeVisite();
    this.initChartJsDemandeLocation();
    this.initChartJsDemandeAchat();
    this.initChartJsContratLocation()
    this.initChartJsContratVente();
    this.initChartJsSuiviEntretien();
  }

  nombreDemandeVisite(): void {
    this.demandeVisiteService.getDemandesVisitesList().subscribe(
      (data) => {
        this.nbreDemandeVisite = data.length;
        this.nbreDemandeVisiteAttente = data.filter(d => d.etatDemande == 0).length;
        this.nbreDemandeVisiteValidee = data.filter(d => d.etatDemande == 1).length;
        this.nbreDemandeVisiteAnnulee = data.filter(d => d.etatDemande == 2).length;
        this.nbreDemandeVisiteRefusee = data.filter(d => d.etatDemande == 3).length;

        this.initChartJsDemandeVisite();
      }
    )
  }

  nombreDemandeAchat(): void {
    this.demandeAchatService.getDemandesAchatsList().subscribe(
      (data) => {
        this.nbreDemandeAchat = data.length;
        this.nbreDemandeAchatAttente = data.filter(d => d.etatDemande == 0).length;
        this.nbreDemandeAchatValidee = data.filter(d => d.etatDemande == 1).length;
        this.nbreDemandeAchatAnnulee = data.filter(d => d.etatDemande == 2).length;
        this.nbreDemandeAchatRefusee = data.filter(d => d.etatDemande == 3).length;

        this.initChartJsDemandeAchat();
      }
    )
  }

  nombreDemandeLocation(): void {
    this.demandeLocationService.getDemandesLocationsList().subscribe(
      (data) => {
        this.nbreDemandeLocation = data.length;
        this.nbreDemandeLocationAttente = data.filter(d => d.etatDemande == 0).length;
        this.nbreDemandeLocationValidee = data.filter(d => d.etatDemande == 1).length;
        this.nbreDemandeLocationAnnulee = data.filter(d => d.etatDemande == 2).length;
        this.nbreDemandeLocationRefusee = data.filter(d => d.etatDemande == 3).length;

        this.initChartJsDemandeLocation();
      }
    )
  }

  nombreContratLocation(): void {
    this.contratLocationService.listContratsLocations().subscribe(
      (data) => {
        this.nbreContratLocation = data.length;
        this.nbreContratLocationRefuse = data.filter(d => d.etatContrat == 'Refusé').length;
        this.nbreContratLocationAttente = data.filter(d => d.etatContrat == 'En attente').length;
        this.nbreContratLocationValide = data.filter(d => d.etatContrat == 'Validé').length;
        this.nbreContratLocationCours = data.filter(d => d.etatContrat == 'En cours').length;
        this.nbreContratLocationTermine = data.filter(d => d.etatContrat == 'Terminé').length;

        this.initChartJsContratLocation();
      }
    )
  }

  nombreContratVente(): void {
    this.contratVenteService.listContratsVentes().subscribe(
      (data) => {
        this.nbreContratVente = data.length;
        this.nbreContratVenteRefuse = data.filter(d => d.etatContrat == 'Refusé').length;
        this.nbreContratVenteAttente = data.filter(d => d.etatContrat == 'En attente').length;
        this.nbreContratVenteValide = data.filter(d => d.etatContrat == 'Validé').length;
        this.nbreContratVenteConfirme = data.filter(d => d.etatContrat == 'Confirmé').length;

        this.initChartJsContratVente();
      }
    )
  }

  nombreSuiviEntretien(): void {
    this.suiviEntretienService.getSuivisEntretiensList().subscribe(
      (data) => {
        this.nbreSuiviEntretien = data.length;
        this.nbreSuiviEntretienAttente = data.filter(s => s.etatSuiviEntretien == 'En attente').length;
        this.nbreSuiviEntretienDebute = data.filter(s => s.etatSuiviEntretien == 'Débuté').length;
        this.nbreSuiviEntretienTermine = data.filter(s => s.etatSuiviEntretien == 'Terminé').length;

        this.initChartJsSuiviEntretien();
      }
    )
  }

  initChartJsDemandeVisite(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataDemandeVisite = {
        labels: ['En attente', 'Validées', 'Annulées', 'Refusées'],
        datasets: [
            {
                data: [this.nbreDemandeVisiteAttente, this.nbreDemandeVisiteValidee, this.nbreDemandeVisiteAnnulee, this.nbreDemandeVisiteRefusee],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')]
            }
        ]
    };


    this.optionsDemandeVisite = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
  }

  initChartJsDemandeLocation(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataDemandeLocation = {
        labels: ['En attente', 'Validées', 'Annulées', 'Refusées'],
        datasets: [
            {
                data: [this.nbreDemandeLocationAttente, this.nbreDemandeLocationValidee, this.nbreDemandeLocationAnnulee, this.nbreDemandeLocationRefusee],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')]
            }
        ]
    };


    this.optionsDemandeLocation = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
  }

  initChartJsDemandeAchat(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataDemandeAchat = {
        labels: ['En attente', 'Validées', 'Annulées', 'Refusées'],
        datasets: [
            {
                data: [this.nbreDemandeAchatAttente, this.nbreDemandeAchatValidee, this.nbreDemandeAchatAnnulee, this.nbreDemandeAchatRefusee],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--red-600')]
            }
        ]
    };


    this.optionsDemandeAchat = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
  }

  initChartJsContratLocation(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataContratLocation = {
        labels: ['En attente', 'Refusés', 'Validés', 'En cours', 'Terminés'],
        datasets: [
            {
                data: [this.nbreContratLocationAttente, this.nbreContratLocationRefuse, this.nbreContratLocationValide, this.nbreContratLocationCours, this.nbreContratLocationTermine],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--blue-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--blue-500')]
            }
        ]
    };


    this.optionsContratLocation = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
  }

  initChartJsContratVente(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataContratVente = {
        labels: ['En attente', 'Refusés', 'Validés', 'Confirmés'],
        datasets: [
            {
                data: [this.nbreContratVenteAttente, this.nbreContratVenteRefuse, this.nbreContratVenteValide, this.nbreContratVenteConfirme],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--red-600'), documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--green-400')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--red-600'), documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };


    this.optionsContratVente = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                }
            }
        }
    };
  }

  initChartJsSuiviEntretien(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataSuiviEntretien = {
        labels: ['En attente', 'Débutés', 'Terminés'],
        datasets: [
            {
                data: [this.nbreSuiviEntretienAttente, this.nbreSuiviEntretienDebute, this.nbreSuiviEntretienTermine],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--green-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--green-600')]
            }
        ]
    };


    this.optionsSuiviEntretien = {
        cutout: '60%',
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
  }

  ngOnDestroy(): void {

  }

}
