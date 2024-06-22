import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-publication',
  templateUrl: './detail-publication.component.html',
  styleUrls: ['./detail-publication.component.css']
})
export class DetailPublicationComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  responsiveOptions: any[] | undefined;

  user: any;
  images: ImagesBienImmobilier[] = [];
  bienImm!: any;
  bienSelectionne!: BienImmobilier;
  publication = this.publicationService.publication;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();

  APIEndpoint: string;
  publicationForm: any;
  publicationReussie: any;
  modificationReussie: any;

  constructor(private publicationService: PublicationService, private activatedRoute: ActivatedRoute,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private personneService: PersonneService, private caracteristiquesServices: CaracteristiquesService,
    private imagesBienImmobilierService: ImagesBienImmobilierService, private router: Router,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
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

  loadData(): void {
    this.modificationReussie = this.activatedRoute.snapshot.queryParamMap.get('modificationReussie') || '';
    this.initResponsiveOptions();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const idBien = this.activatedRoute.snapshot.queryParamMap.get('idBien');

      if (id) {
        if (idBien) {
          this.getImagesBienImmobilier(parseInt(idBien));
        }
        this.detailPublication(parseInt(id));
      }
    });
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

  detailPublication(id: number): void {
    this.publicationService.findById(id).subscribe(
      (response) => {
        this.publication = response;
        this.bienSelectionne = this.publication.bienImmobilier;
        if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.publication.bienImmobilier.id);
        }

        if (this.modificationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Modification réussie', detail: 'La publication a été modifié avec succès.' });
        }
      }
    )
  }

  //Fonction pour afficher les détails d'un bien immobilier
  detailBienImmobilier(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        if (!this.isTypeBienTerrain(this.bienImm.typeDeBien.designation)) {
          this.detailCaracteristiquesBien(id);
        }
      }
    );
  }

  //Fonction pour afficher les détails d'un bien associé
  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        this.detailCaracteristiquesBien(id);
      }
    );
  }

  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiquesServices.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  afficherPageDetail(id: number, idBien: number) {
    this.getImagesBienImmobilier(idBien);
    this.detailPublication(id);
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/publications']);
  }

  voirPageModifier(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/update/publication/' + id]);
  }

  activerPublication(id: number, idBien: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette publication ?',
      header: "Activation d'une publication",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publicationService.activerPublication(id).subscribe(
        (response) => {
          this.modificationReussie = false;
          this.afficherPageDetail(id, idBien)
          this.messageSuccess = "La publication a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation d\'une publication confirmée',
            detail: this.messageSuccess
          })
        },
        (error) => {
          if (error.error =  "Un contrat de location est toujours en cours pour ce bien immobilier.") {
            this.messageService.add({
              severity: 'warn',
              summary: 'Publication non réussie',
              detail: error.error
            })
          } else if (error.error == "Un contrat de vente a été confirmé pour ce bien immobilier") {
            this.messageService.add({
              severity: 'warn',
              summary: 'Publication non réussie',
              detail: error.error
            })
          } else if (error.error == "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
            this.messageService.add({
              severity: 'warn',
              summary: 'Publication non réussie',
              detail: error.error
            });
          } else if (error.error == "Une publication avec un des biens associés à ce bien support est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
            this.messageService.add({
              severity: 'warn',
              summary: 'Publication non réussie',
              detail: error.error
            });
          } else if (error.error == "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
            this.messageService.add({
              severity: 'warn',
              summary: 'Publication non réussie',
              detail: error.error
            });
          }
        })
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de la publication rejetée',
              detail: "Vous avez rejeté l'activation de cette publication !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de la publication annulée',
              detail: "Vous avez annulé l'activation de cette publication !"
            });
            break;
        }
      }
    });
  }

  desactiverPublication(id: number, idBien: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette publication ?',
      header: "Désactivaction d'une publication",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publicationService.desactiverPublication(id).subscribe(
          (response) => {
            this.modificationReussie = false;
            this.afficherPageDetail(id, idBien)
            this.messageSuccess = "La publication a été désactivé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Désactivation d\'une publication confirmée',
              detail: this.messageSuccess
            })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de la publication rejetée',
              detail: "Vous avez rejeté la désactivation de cette publication !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de la publication annulée',
              detail: "Vous avez annulé la désactivation de cette publication !"
            });
            break;
        }
      }
    });
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
    if (this.personneService.estProprietaire(this.user.role.code)) {
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
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
