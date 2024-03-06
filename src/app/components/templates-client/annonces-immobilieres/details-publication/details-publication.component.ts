import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Galleria } from 'primeng/galleria';
import { Page } from 'src/app/interfaces/Page';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-publication',
  templateUrl: './details-publication.component.html',
  styleUrls: ['./details-publication.component.css']
})
export class DetailsPublicationComponent implements OnInit, OnDestroy  {

  loading: boolean = false;
  activeIndex: number = 0;

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

  constructor(private publicationService: PublicationService,
    private route: ActivatedRoute, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private caracteristiquesServices: CaracteristiquesService, private cd: ChangeDetectorRef, private decimalPipe: DecimalPipe)
  {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
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
    this.bindDocumentListeners();
    this.route.paramMap.subscribe(params => {
      const codePublication = params.get('codePublication');
      console.log(codePublication);

      if (codePublication) {
        this.detailPublication(codePublication);
      }
    });
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
      }
    )
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiquesServices.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        console.log(response)
        this.caracteristique = response;
      }
    );
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.activeIndex == 0) {
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
    } else if (this.activeIndex == 1) {
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
    } else {
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
  }

  filtrePublications(activeIndex: number): void {
    this.activeIndex = activeIndex;
    if (this.activeIndex == 0) {
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
    } else if (this.activeIndex == 1) {
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
    } else {
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
  }

  galleriaClass() {
      return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
      return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
  }
}
