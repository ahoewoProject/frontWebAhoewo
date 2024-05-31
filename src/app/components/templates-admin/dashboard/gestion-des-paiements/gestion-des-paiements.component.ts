import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';

@Component({
  selector: 'app-gestion-des-paiements',
  templateUrl: './gestion-des-paiements.component.html',
  styleUrls: ['./gestion-des-paiements.component.css']
})
export class GestionDesPaiementsComponent implements OnInit, OnDestroy {

  nbrePlanificationPaiement: number = 0; nbrePlanificationPaiementAttente: number = 0;
  nbrePlanificationPaiementPaye: number = 0;

  nbrePaiement: number = 0; nbrePaiementAttente: number = 0;
  nbrePaiementEffectue: number = 0;

  dataPlanificationPaiement: any; optionsPlanificationPaiement: any;
  dataPaiement: any; optionsPaiement: any;

  constructor(private planficationPaiementService: PlanificationPaiementService, private paiementService: PaiementService) {

  }

  ngOnInit(): void {
    this.nombrePlanificationPaiement();
    this.nombrePaiement();
  }

  nombrePlanificationPaiement(): void {
    this.planficationPaiementService.getPlanificationsPaiementsList()
    .subscribe(
      (data) => {
        this.nbrePlanificationPaiement = data.length;
        this.nbrePlanificationPaiementAttente = data.filter(p => p.statutPlanification == 'En attente').length;
        this.nbrePlanificationPaiementPaye = data.filter(p => p.statutPlanification == 'Payé').length;
      }
    )
  }

  nombrePaiement(): void {
    this.paiementService.getPaiementsList().subscribe(
      (data) => {
        this.nbrePaiement = data.length;
        this.nbrePaiementAttente = data.filter(p => p.statutPaiement == 'En attente').length;
        this.nbrePaiementEffectue = data.filter(p => p.statutPaiement == 'Effectué').length;

        this.initChartJsPlanificationPaiement();
        this.initChartJsPaiement();
      }
    )
  }

  initChartJsPlanificationPaiement(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataPlanificationPaiement = {
        labels: ['En attente', 'Payés'],
        datasets: [
            {
                data: [this.nbrePlanificationPaiementAttente, this.nbrePlanificationPaiementPaye],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-500')]
            }
        ]
    };


    this.optionsPlanificationPaiement = {
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

  initChartJsPaiement(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataPaiement = {
        labels: ['En attente', 'Effectués'],
        datasets: [
            {
                data: [this.nbrePaiementAttente, this.nbrePaiementEffectue],
                backgroundColor: [documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')]
            }
        ]
    };


    this.optionsPaiement = {
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
