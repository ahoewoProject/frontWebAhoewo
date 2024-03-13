import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { ContactezNousForm } from 'src/app/models/ContactezNousForm';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { ContactezNousService } from 'src/app/services/contactez-nous.service';
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
  loadingMessage: string = 'Chargement du formulaire en cours !';
  activeIndex: number = 0;

  numeroDeLaPage = 0;
  elementsParPage = 6;
  agenceImmobiliere: AgenceImmobiliere = new AgenceImmobiliere();
  contactezNousForm2: ContactezNousForm = new ContactezNousForm();
  APIEndpoint: string;
  nomAgence: any;
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  publications!: Page<Publication>;

  contactezNousForm1: any;

  constructor(private route: ActivatedRoute,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private _serviceAgenceService: ServicesAgenceImmobiliereService,
    private datePipe: DatePipe, private publicationService: PublicationService,
    private contactezNousService: ContactezNousService, private messageService: MessageService,
    private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;

    this.route.paramMap.subscribe(params => {
      this.nomAgence = params.get('nomAgence');
    });
  }

  ngOnInit(): void {
    this.initContactezNousForm();
    this.detailAgenceImmobiliere();
    this.listeServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  detailPublicationPage(publication: Publication): void {
    const codePublication = JSON.stringify(publication.codePublication);
    sessionStorage.setItem('codePublication', codePublication);
    this.router.navigate(['/annonce-immobiliere']);
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

  initContactezNousForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.contactezNousForm1 = new FormGroup({
      nomPrenoms: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      emetteurEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      message: new FormControl('', Validators.required)
    })
  }

  get nomPrenoms() {
    return this.contactezNousForm1.get('nomPrenoms');
  }

  get telephone() {
    return this.contactezNousForm1.get('telephone');
  }

  get emetteurEmail() {
    return this.contactezNousForm1.get('emetteurEmail');
  }

  get message() {
    return this.contactezNousForm1.get('message');
  }

  resetContactezNousForm(): void {
    this.contactezNousForm1.reset();
  }

  contactezNous(): void {
    this.loading = true;
    this.loadingMessage = 'Envoi du message de contact en cours !';
    this.contactezNousForm2.recepteurEmail = this.agenceImmobiliere.adresseEmail;
    setTimeout(() => {
      this.contactezNousService.contactezNous(this.contactezNousForm2).subscribe(
        (response) => {
          this.loading = false;
          this.messageService.add({severity:'success', summary: 'Message envoyé', detail: 'Votre message a été envoyé avec succès'});
        }
      );
    }, 5000);
    this.resetContactezNousForm();
  }

  formatDate(datePublication: Date): string {
    const now = new Date();
    const publicationDate = new Date(datePublication);
    const diff = now.getTime() - publicationDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 1000 * 60 * 60 * 24) {
      // Aujourd'hui
      return `Aujourd'hui, à ${this.formatTime(publicationDate)}`;
    } else if (diff < 1000 * 60 * 60 * 24 * 2) {
      // Hier
      return `Hier, à ${this.formatTime(publicationDate)}`;
    } else if (diff < 1000 * 60 * 60 * 24 * 3) {
      // Avant-hier
      return `Avant-hier, à ${this.formatTime(publicationDate)}`;
    } else {
      // Autre date
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `le ${publicationDate.getDate()} ${months[publicationDate.getMonth()]} à ${this.formatTime(publicationDate)}`;
    }
  }

  // Fonction pour formater l'heure
  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours} heures ${minutes} minutes`;
  }
}
