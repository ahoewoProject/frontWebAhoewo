import { PersonneService } from './../../../../services/gestionDesComptes/personne.service';
import { DecimalPipe, Time } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Galleria } from 'primeng/galleria';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { ContactezNousForm } from 'src/app/models/ContactezNousForm';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeAchat } from 'src/app/models/gestionDesLocationsEtVentes/DemandeAchat';
import { DemandeLocation } from 'src/app/models/gestionDesLocationsEtVentes/DemandeLocation';
import { DemandeRequest } from 'src/app/models/gestionDesLocationsEtVentes/DemandeRequest';
import { DemandeVisite } from 'src/app/models/gestionDesLocationsEtVentes/DemandeVisite';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { ContactezNousService } from 'src/app/services/contactez-nous.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { DemandeAchatService } from 'src/app/services/gestionDesLocationsEtVentes/demande-achat.service';
import { DemandeLocationService } from 'src/app/services/gestionDesLocationsEtVentes/demande-location.service';
import { DemandeVisiteService } from 'src/app/services/gestionDesLocationsEtVentes/demande-visite.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-publication',
  templateUrl: './details-publication.component.html',
  styleUrls: ['./details-publication.component.css']
})
export class DetailsPublicationComponent implements OnInit, OnDestroy  {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  minDate: Date = new Date();
  loading: boolean = false;
  loadingContactForm: boolean = false;
  loadingMessage: string = 'Chargement du formulaire en cours !';
  activeIndex: number = 0;
  contactezNousForm1: any;
  contactezNousForm2: ContactezNousForm = new ContactezNousForm();
  demandeRequest: DemandeRequest = new DemandeRequest();
  demandeVisite: DemandeVisite = new DemandeVisite();
  demandeLocation: DemandeLocation = new DemandeLocation();
  demandeAchat: DemandeAchat = new DemandeAchat();
  demandeForm: any;
  visible: boolean = false;
  typesDeDemandes: string[] = [];
  typeDeDemandeSelectionne!: string;

  numeroDeLaPage = 0;
  elementsParPage = 2;

  images: ImagesBienImmobilier[] = [];
  responsiveOptions: any[] | undefined;
  bienImm!: any;
  caracteristique: Caracteristiques = new Caracteristiques();
  publication = this.publicationService.publication;
  publications!: Page<Publication>;

  showThumbnails!: boolean;

  fullscreen: boolean = false;

  onFullScreenListener: any;

  @ViewChild('galleria') galleria: Galleria | undefined;

  APIEndpoint: string;
  user: any;

  constructor(private publicationService: PublicationService,
    private router: Router, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private caracteristiquesServices: CaracteristiquesService, private cd: ChangeDetectorRef,
    private decimalPipe: DecimalPipe, private contactezNousService: ContactezNousService,
    private messageService: MessageService, private personneService: PersonneService,
    private activatedRoute: ActivatedRoute, private demandeLocationService: DemandeLocationService,
    private demandeAchatService: DemandeAchatService, private demandeVisiteService: DemandeVisiteService,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    if (utilisateurConnecte) {
      this.user = JSON.parse(utilisateurConnecte);
    }
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

  initActivatedRoute(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const codePublication = params['key'];
      if (codePublication) {
        this.detailPublication(codePublication);
      }
    });
  }

  loadData(): void {
    this.initDemandeForm();
    this.initContactezNousForm();
    this.initResponsiveOptions();
    this.bindDocumentListeners();
    this.initActivatedRoute();
  }

  initResponsiveOptions(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
    ];
  }

  listeTypesDeDemandes(): void {
    this.typesDeDemandes = ['Demande de visite', 'Demande de location', 'Demande d\'achat'];
    this.typeDeDemandeSelectionne = this.typesDeDemandes[0];
  }

  typeDeDemandeChoisi(event: any): void {
    this.typeDeDemandeSelectionne = event.value;
    this.validerDemandeForm();
  }

  initDemandeForm(): void {
    this.demandeForm = new FormGroup({
      dateHeureVisite: new FormControl(''),
      prixDeLocation: new FormControl(''),
      prixAchat: new FormControl(''),
      nombreDeTranche: new FormControl('')
    })
  }

  get dateHeureVisite() {
    return this.demandeForm.get('dateHeureVisite');
  }

  get prixDeLocation() {
    return this.demandeForm.get('prixDeLocation');
  }

  get prixAchat() {
    return this.demandeForm.get('prixAchat');
  }

  get nombreDeTranche() {
    return this.demandeForm.get('nombreDeTranche');
  }

  onSelectDateHeureVisite(event: any): void {
    // this.demandeRequest.dateHeureVisite = event.value;
    console.log(this.demandeRequest.dateHeureVisite)
  }

  soumettre(): void {

    if (this.personneService.estConnecte()) {
      if (this.user.role.code != 'ROLE_CLIENT') {
        this.messageService.add({
          severity:'error',
          summary: 'Soumission non autorisée',
          detail: 'Vous devez être un client pour soumettre une demande !'
        });
        return;
      } else {
        if (this.typeDeDemandeSelectionne == 'Demande de visite') {
          this.soumettreDemandeVisite();
        } else if (this.typeDeDemandeSelectionne == 'Demande de location') {
          this.soumettreDemandeLocation();
        } else {
          this.soumettreDemandeAchat();
        }
      }
    } else {
      this.demandeRequest.typeDeDemande = this.typeDeDemandeSelectionne;
      localStorage.setItem('demandeRequest', JSON.stringify(this.demandeRequest));
      this.router.navigate(['/connexion'] , { queryParams: { from: this.router.url } });
    }
  }

  soumettreDemandeVisite(): void {
    this.demandeVisite.publication = this.publication;
    this.demandeVisite.client = this.user;
    this.demandeVisite.dateHeureVisite = this.demandeRequest.dateHeureVisite;
    console.log(this.demandeVisite)
    this.demandeVisiteService.addDemandeVisite(this.demandeVisite).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/client/demandes-visites'], { queryParams: { demandeVisiteReussie: true } });
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Votre demande de visite n\'a pas été soumise !'
          })
        }
      },
      (error) => {
        if (error.status == 409) {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Vous avez déjà soumis une demande de visite pour cette publication !'
          })
        }
      }
    )

  }

  soumettreDemandeLocation(): void {
    this.demandeLocation.publication = this.publication;
    this.demandeLocation.client = this.user;
    this.demandeLocation.prixDeLocation = this.demandeRequest.prixDeLocation;
    this.demandeLocation.avance = this.demandeRequest.avance;
    this.demandeLocation.caution = this.demandeRequest.caution;
    console.log(this.demandeLocation)
    this.demandeLocationService.addDemandeLocation(this.demandeLocation).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/client/demandes-locations'], { queryParams: { demandeLocationReussie: true } });
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Votre demande de location n\'a pas été soumise !'
          })
        }
      },
      (error) => {
        if (error.status == 409) {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Vous avez déjà soumis une demande de location pour cette publication !'
          })
        }
      }
    )
  }

  soumettreDemandeAchat(): void {
    this.demandeAchat.publication = this.publication;
    this.demandeAchat.client = this.user;
    this.demandeAchat.prixAchat = this.demandeRequest.prixAchat;
    this.demandeAchat.nombreDeTranche = this.demandeRequest.nombreDeTranche;
    console.log(this.demandeAchat)
    this.demandeAchatService.addDemandeAchat(this.demandeAchat).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/client/demandes-achats'], { queryParams: { demandeAchatReussie: true } });
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Votre demande d\'achat n\'a pas été soumise !'
          })
        }
      },
      (error) => {
        console.log(error)
        if (error.status == 409) {
          this.messageService.add({
            severity:'error',
            summary: 'Echec de la demande',
            detail: 'Vous avez déjà soumis une demande d\'achat pour cette publication !'
          })
        }
      }
    )
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  detailPublication(code: string): void {
    this.publicationService.findByCodePublication(code).subscribe(
      (response) => {
        this.publication = response;
        this.getImagesBienImmobilier(this.publication.bienImmobilier.id);
        this.listePublicationsActivesParTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage);
        if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailCaracteristiquesBien(this.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailCaracteristiquesBien(this.publication.bienImmobilier.id);
        }

        if (localStorage.getItem('demandeRequest')) {
          this.demandeRequest = JSON.parse(localStorage.getItem('demandeRequest')!);
          if (this.publication.typeDeTransaction == 'Vente') {
            this.typesDeDemandes = ['Demande de visite', 'Demande d\'achat'];
          } else {
            this.typesDeDemandes = ['Demande de visite', 'Demande de location'];
          }
          this.typeDeDemandeSelectionne = this.demandeRequest.typeDeDemande;
          this.demandeRequest.dateHeureVisite = new Date(this.demandeRequest.dateHeureVisite);
          this.validerDemandeForm();
          console.log(this.demandeRequest)
        } else {
          if (this.publication.typeDeTransaction == 'Vente') {
            this.typesDeDemandes = ['Demande de visite', 'Demande d\'achat'];
            this.typeDeDemandeSelectionne = this.typesDeDemandes[1];
          } else {
            this.typesDeDemandes = ['Demande de visite', 'Demande de location'];
            this.typeDeDemandeSelectionne = this.typesDeDemandes[1];
          }
          this.validerDemandeForm();
        }
      }
    )
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiquesServices.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.activeIndex == 0) {
      this.paginationActiveIndex0();
    } else if (this.activeIndex == 1) {
      this.paginationActiveIndex1();
    } else {
      this.paginationActiveIndex2();
    }
  }

  paginationActiveIndex0(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(p => p.id !== this.publication.id)
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  paginationActiveIndex1(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(
              publication => publication.typeDeTransaction === 'Location' &&
              publication.id !== this.publication.id
            )
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  paginationActiveIndex2(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(
              publication => publication.typeDeTransaction === 'Vente'&&
              publication.id !== this.publication.id
            )
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  filtrePublications(activeIndex: number): void {
    this.activeIndex = activeIndex;
    if (activeIndex === 0) {
      this.filtrePublicationsActiveIndex0();
    } else if (activeIndex === 1) {
      this.filtrePublicationsActiveIndex1();
    } else if (activeIndex === 2) {
      this.filtrePublicationsActiveIndex2();
    }
  }

  filtrePublicationsActiveIndex0(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(p => p.id !== this.publication.id)
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  filtrePublicationsActiveIndex1(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(
              publication => publication.typeDeTransaction === 'Location' &&
              publication.id !== this.publication.id
            )
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  filtrePublicationsActiveIndex2(): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(this.publication.bienImmobilier.typeDeBien.designation, this.numeroDeLaPage, this.elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(
              publication => publication.typeDeTransaction === 'Vente' &&
              publication.id !== this.publication.id
            )
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  private isTypeBienTerrain(designation :string): boolean {
    return designation === "Terrain";
  }

  private isTypeDeBienSupport(designation: string): boolean {
    return designation === "Maison" || designation === 'Villa' || designation === "Immeuble";
  }

  private isTypeDeBienAssocie(designation: string): boolean {
    return designation === "Appartement" || designation === "Chambre salon" || designation === "Chambre" ||
      designation === "Bureau" || designation === "Magasin" || designation === "Boutique";
  }

  listePublicationsActivesParTypeDeBien(designation: string, numeroDeLaPage: number, elementsParPage: number): void {
    this.loading = true
    setTimeout(() => {
      this.publicationService.getPublicationsActivesByTypeDeBien(designation, numeroDeLaPage, elementsParPage).subscribe(
        (response) => {
          this.publications = {
            ...response,
            content: response.content.filter(p => p.id !== this.publication.id)
          };
          this.loading = false
        }
      )
    }, 5000);
  }

  afficherCategorie(): boolean {
    return this.publication.bienImmobilier.typeDeBien.designation == 'Maison' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Villa' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Immeuble' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Appartement' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Chambre salon' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Chambre' ||
    this.publication.bienImmobilier.typeDeBien.designation == 'Bureau';
  }

  getElapsedTime(dateNotification: Date): string {
    const now = new Date();
    const notificationDate = new Date(dateNotification);

    const elapsedMilliseconds = now.getTime() - notificationDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 0) {
      return `Il y a ${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`;
    } else if (elapsedHours > 0) {
      return `Il y a ${elapsedHours} heure${elapsedHours > 1 ? 's' : ''}`;
    } else if (elapsedMinutes > 0) {
      return `Il y a ${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${elapsedSeconds} seconde${elapsedSeconds > 1 ? 's' : ''}`;
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
    this.loadingContactForm = true;
    // this.loadingMessage = 'Envoi du message en cours !';

    if (this.publication.agenceImmobiliere) {
      this.contactezNousForm2.recepteurEmail = this.publication.agenceImmobiliere.adresseEmail;
    } else {
      this.contactezNousForm2.recepteurEmail = this.publication.personne.email;
    }

    this.contactezNousService.contactezNous(this.contactezNousForm2).subscribe(
      (response) => {
        this.messageService.add({
          severity:'success',
          summary: 'Message envoyé',
          detail: 'Votre message a été envoyé avec succès'
        });
        this.resetContactezNousForm();
        this.loadingContactForm = false;
      }
    );
  }

  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
      if (this.fullscreen) {
          this.closePreviewFullScreen();
      } else {
          this.openPreviewFullScreen();
      }

      this.cd.detach();
  }

  openPreviewFullScreen() {
      let elem = this.galleria?.element.nativeElement.querySelector('.p-galleria');
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem['mozRequestFullScreen']) {
          /* Firefox */
          elem['mozRequestFullScreen']();
      } else if (elem['webkitRequestFullscreen']) {
          /* Chrome, Safari & Opera */
          elem['webkitRequestFullscreen']();
      } else if (elem['msRequestFullscreen']) {
          /* IE/Edge */
          elem['msRequestFullscreen']();
      }
  }

  onFullScreenChange() {
      this.fullscreen = !this.fullscreen;
      this.cd.detectChanges();
      this.cd.reattach();
  }

  closePreviewFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any)['mozCancelFullScreen']) {
        (document as any)['mozCancelFullScreen']();
    } else if ((document as any)['webkitExitFullscreen']) {
        (document as any)['webkitExitFullscreen']();
    } else if ((document as any)['msExitFullscreen']) {
        (document as any)['msExitFullscreen']();
    }
  }

  bindDocumentListeners() {
      this.onFullScreenListener = this.onFullScreenChange.bind(this);
      document.addEventListener('fullscreenchange', this.onFullScreenListener);
      document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
      document.addEventListener('webkitfullscreenchange', this.onFullScreenListener);
      document.addEventListener('msfullscreenchange', this.onFullScreenListener);
  }

  unbindDocumentListeners() {
      document.removeEventListener('fullscreenchange', this.onFullScreenListener);
      document.removeEventListener('mozfullscreenchange', this.onFullScreenListener);
      document.removeEventListener('webkitfullscreenchange', this.onFullScreenListener);
      document.removeEventListener('msfullscreenchange', this.onFullScreenListener);
      this.onFullScreenListener = null;
  }

  ngOnDestroy() {
    this.unbindDocumentListeners();
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }

  galleriaClass() {
      return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
      return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
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

  validerDemandeForm(): void {
    if (this.typeDeDemandeSelectionne == 'Demande de visite') {
      this.dateHeureVisite.setValidators([Validators.required]);
      this.prixDeLocation.clearValidators();
      this.prixAchat.clearValidators();
      this.nombreDeTranche.clearValidators();
    } else if (this.typeDeDemandeSelectionne == 'Demande de location') {
      this.dateHeureVisite.clearValidators();
      this.prixDeLocation.setValidators([Validators.required]);
      this.prixAchat.clearValidators();
      this.nombreDeTranche.clearValidators();
    } else {
      this.dateHeureVisite.clearValidators();
      this.prixDeLocation.clearValidators();
      this.prixAchat.setValidators([Validators.required]);
      this.nombreDeTranche.setValidators([Validators.required]);
    }

    this.dateHeureVisite.updateValueAndValidity();
    this.prixDeLocation.updateValueAndValidity();
    this.prixAchat.updateValueAndValidity();
    this.nombreDeTranche.updateValueAndValidity();
  }
}
