import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  responsiveOptions: any[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  user: any;
  biensImmobiliers: BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  publications!: Page<Publication>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();

  APIEndpoint: string;
  publicationForm: any;
  publicationReussie: any;

  constructor(private publicationService: PublicationService, private activatedRoute: ActivatedRoute,
    private bienImmobilierService: BienImmobilierService, private messageService: MessageService,
    private personneService: PersonneService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.publicationReussie = this.activatedRoute.snapshot.queryParamMap.get('publicationReussie') || '';
    this.initResponsiveOptions();
    if (this.personneService.estProprietaire(this.user.role.code)) {
      this.listeBiensPropres();
    } else {
      this.listeBiensPropresEtDelegues();
    }
    this.listePublications(this.numeroDeLaPage, this.elementsParPage);
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

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  // Liste des biens propres et délégués(Responsable, Agent immobilier, Démarcheur, Gérant)
  listeBiensPropresEtDelegues(): void {
    this.bienImmobilierService.getBiensPropresDelegues().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  // Liste des biens d'un propriétaire
  listeBiensPropres(): void {
    this.bienImmobilierService.getBiensByProprietaire().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  listePublications(numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublications(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
        if (this.publicationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Publication réussie', detail: 'Le bien correspondant a été publié avec succès.' });
        }
      }
    )
  }

  //Page détails par url
  voirPageDetail(idPublication: number, idBien: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/publication', idPublication], { queryParams: { idBien: idBien } });
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePublications(this.numeroDeLaPage, this.elementsParPage);
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_ADMINISTRATEUR':
        roleBasedURL = '/admin';
        break;
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable/agences-immobilieres';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
        break;
      case 'ROLE_CLIENT':
        roleBasedURL = '/client';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  afficherBoutonSiBienDelegue(estDelegue: boolean): boolean {
    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      if (estDelegue) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  ngOnDestroy(): void {

  }
}
