import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';

@Component({
  selector: 'app-gestion-des-publications',
  templateUrl: './gestion-des-publications.component.html',
  styleUrls: ['./gestion-des-publications.component.css']
})
export class GestionDesPublicationsComponent implements OnInit, OnDestroy {

  nbrePublications: number = 0; nbrePublicationsActivees: number = 0;
  nbrePublicationsDesactivees: number = 0; nbrePublicationsLocations: number = 0;
  nbrePublicationsVentes: number = 0; nbreBiensDeleguesPublies: number = 0;

  dataPublicationActiveeDesactivee: any; optionsPublicationActiveeDesactivee: any;
  dataPublicationLocationVente: any; optionsPublicationLocationVente: any;

  constructor(private publicationService: PublicationService) {

  }

  ngOnInit(): void {
    this.nombrePublications();
  }

  nombrePublications(): void {
    this.publicationService.getPublicationsByUser().subscribe(
      (data) => {
        console.log(data);
        this.nbrePublications = data.length;
        this.nbrePublicationsActivees =  data.filter(p => p.etat === true).length;
        this.nbrePublicationsDesactivees = data.filter(p => p.etat === false).length;
        this.nbrePublicationsLocations = data.filter(p => p.typeDeTransaction === 'Location').length;
        this.nbrePublicationsVentes = data.filter(p => p.typeDeTransaction === 'Vente').length;

        this.nbreBiensDeleguesPublies = data.filter(p => p.bienImmobilier.estDelegue = true).length;

        this.initChartJs1();
        this.initChartJs2();
      }
    )
  }

  initChartJs1(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataPublicationActiveeDesactivee = {
        labels: ['Actives', 'Désactivées'],
        datasets: [
            {
                data: [this.nbrePublicationsActivees, this.nbrePublicationsDesactivees],
                backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-600')]
            }
        ]
    };


    this.optionsPublicationActiveeDesactivee = {
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

  initChartJs2(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataPublicationLocationVente = {
        labels: ['En vente', 'En location'],
        datasets: [
            {
                data: [this.nbrePublicationsVentes, this.nbrePublicationsLocations],
                backgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-400')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-500')]
            }
        ]
    };


    this.optionsPublicationLocationVente = {
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
