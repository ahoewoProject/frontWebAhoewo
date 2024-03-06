import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-agence',
  templateUrl: './details-agence.component.html',
  styleUrls: ['./details-agence.component.css']
})
export class DetailsAgenceComponent implements OnInit {

  loading: boolean = false;
  activeIndex: number = 0;

  numeroDeLaPage = 0;
  elementsParPage = 6;
  agenceImmobiliere: AgenceImmobiliere = new AgenceImmobiliere();
  APIEndpoint: string;
  nomAgence: any;
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  publications!: Page<Publication>;

  constructor(private route: ActivatedRoute,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private _serviceAgenceService: ServicesAgenceImmobiliereService,
    private datePipe: DatePipe, private publicationService: PublicationService) {
    this.APIEndpoint = environment.APIEndpoint;

    this.route.paramMap.subscribe(params => {
      this.nomAgence = params.get('nomAgence');
    });
  }

  ngOnInit(): void {
    this.detailAgenceImmobiliere();
    this.listeServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  detailAgenceImmobiliere(): void {
    this.agenceImmobiliereService.findAgenceByNom(this.nomAgence).subscribe(
      (data: AgenceImmobiliere) => {
        console.log(data)
        this.agenceImmobiliere = data;
        this.listePublicationsActivesParAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage);
      }
    );
  }

  listeServicesAgenceImmobiliere(numeroDeLaPage: number, elementsParPage: number): void {
    this._serviceAgenceService.getServicesByNomAgence(this.nomAgence, numeroDeLaPage, elementsParPage).subscribe(
      (data: Page<ServicesAgenceImmobiliere>) => {
        console.log(data)
        this.servicesAgenceImmobiliere = data;
      }
    );
  }

  listePublicationsActivesParAgence(nomAgence: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublicationsActivesByAgence(nomAgence, numeroDeLaPage, elementsParPage).subscribe(
      (data: Page<Publication>) => {
        console.log(data)
        this.publications = data;
      }
    );
  }


  paginationServices(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  paginationPublications(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;

    if (this.activeIndex == 0) {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = response;
            this.loading = false
          }
        )
      }, 5000);
    } else if (this.activeIndex == 1) {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = {
              ...response,
              content: response.content.filter(
                publication => publication.typeDeTransaction === 'Location'
              )
            };
            this.loading = false
          }
        )
      }, 5000);
    } else if (this.activeIndex == 2) {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = {
              ...response,
              content: response.content.filter(
                publication => publication.typeDeTransaction === 'Vente'
              )
            };
            this.loading = false
          }
        )
      }, 5000);
    } else {
      this.listePublicationsActivesParAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage);
    }
  }

  filtrePublications(activeIndex: number): void {
    this.activeIndex = activeIndex;
    if (this.activeIndex == 0) {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = response;
            this.loading = false
          }
        )
      }, 5000);
    } else if (this.activeIndex == 1) {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = {
              ...response,
              content: response.content.filter(
                publication => publication.typeDeTransaction === 'Location'
              )
            };
            this.loading = false
          }
        )
      }, 5000);
    } else {
      this.loading = true
      setTimeout(() => {
        this.publicationService.getPublicationsActivesByAgence(this.agenceImmobiliere.nomAgence, this.numeroDeLaPage, this.elementsParPage).subscribe(
          (response) => {
            this.publications = {
              ...response,
              content: response.content.filter(
                publication => publication.typeDeTransaction === 'Vente'
              )
            };
            this.loading = false
          }
        )
      }, 5000);
    }
  }

  afficherRegion(libelle: string): string {
    if (libelle === 'Maritime') {
        return 'Région Maritime';
    } else if (libelle === 'Plateaux') {
        return 'Région des Plateaux';
    } else if (libelle === 'Centrale') {
        return 'Région Centrale';
    } else if (libelle === 'Kara') {
        return 'Région de la Kara';
    } else if (libelle === 'Savanes') {
        return 'Région des Savanes';
    } else {
        return 'Région inconnue';
    }
  }

  public fermetureOrOuvertureAgence(heureOuverture: string, heureFermeture: string): boolean {
    const now: Date = new Date();
    const formattedHeureOuverture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureOuverture;
    const formattedHeureFermeture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureFermeture;

    const _heureOuverture: Date = new Date(formattedHeureOuverture);
    const _heureFermeture: Date = new Date(formattedHeureFermeture);

    if (now >= _heureOuverture && now <= _heureFermeture) {
      return true;
    } else {
      return false;
    }
  }
}
