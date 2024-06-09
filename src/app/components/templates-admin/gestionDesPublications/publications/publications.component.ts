import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
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
  typesDeTransactions: string[] = [];
  typeDeTransactionSelectionne!: string;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  user: any;
  biensImmobiliers: BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  bienImm!: any;
  bienSelectionne!: BienImmobilier;
  publication = this.publicationService.publication;
  publications!: Page<Publication>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();

  APIEndpoint: string;
  publicationForm: any;
  publicationReussie: any;

  constructor(private publicationService: PublicationService, private activatedRoute: ActivatedRoute,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private personneService: PersonneService, private caracteristiquesServices: CaracteristiquesService,
    private imagesBienImmobilierService: ImagesBienImmobilierService, private router: Router
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
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

  ajouterPublication(): void {
    this.publication.bienImmobilier = this.bienSelectionne;
    this.publication.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.publicationService.ajouterPublication(this.publication).subscribe(
      (response) => {
        if (response.id > 0) {

          this.messageSuccess = "La publication a été ajouté avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Publication réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.messageService.add({
            severity: 'error',
            summary: 'Publication échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        this.messageErreur = error.error;
        let messageDetail = '';

        switch (this.messageErreur) {
          case "Un contrat de location est toujours en cours pour ce bien immobilier.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec un des biens associés à ce bien support est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          case "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.":
            messageDetail = this.messageErreur;
            break;
          default:
            messageDetail = "Erreur inconnue";
            break;
        }

        if (messageDetail !== "Erreur inconnue") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: messageDetail
          });
        }
      }
    )
  }

  afficherCategorie(): boolean {
    return this.bienImm.typeDeBien.designation == 'Maison' ||
    this.bienImm.typeDeBien.designation == 'Villa' ||
    this.bienImm.typeDeBien.designation == 'Immeuble' ||
    this.bienImm.typeDeBien.designation == 'Appartement' ||
    this.bienImm.typeDeBien.designation == 'Chambre salon' ||
    this.bienImm.typeDeBien.designation == 'Chambre' ||
    this.bienImm.typeDeBien.designation == 'Bureau';
  }

  afficherCaracteristique(): boolean {
    return this.bienImm.typeDeBien.designation == 'Maison' ||
    this.bienImm.typeDeBien.designation == 'Villa' ||
    this.bienImm.typeDeBien.designation == 'Immeuble' ||
    this.bienImm.typeDeBien.designation == 'Appartement' ||
    this.bienImm.typeDeBien.designation == 'Chambre salon' ||
    this.bienImm.typeDeBien.designation == 'Chambre' ||
    this.bienImm.typeDeBien.designation == 'Bureau' ||
    this.bienImm.typeDeBien.designation == 'Magasin' ||
    this.bienImm.typeDeBien.designation == 'Boutique';
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
