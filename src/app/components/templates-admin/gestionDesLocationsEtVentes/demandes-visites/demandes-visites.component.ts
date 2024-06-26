import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Motif } from 'src/app/models/Motif';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeVisite } from 'src/app/models/gestionDesLocationsEtVentes/DemandeVisite';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { DemandeVisiteService } from 'src/app/services/gestionDesLocationsEtVentes/demande-visite.service';
import { MotifService } from 'src/app/services/motif.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-demandes-visites',
  templateUrl: './demandes-visites.component.html',
  styleUrls: ['./demandes-visites.component.css']
})
export class DemandesVisitesComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  minDate: Date = new Date();
  modalRefusVisible: boolean = false;
  modalAnnulationVisible: boolean = false;
  recherche: string = '';
  affichage = 1;
  responsiveOptions: any[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  demandeVisite = this.demandeVisiteService.demandeVisite;
  demandesVisites!: Page<DemandeVisite>;
  dateHeureVisiteSelectionne!: Date;
  APIEndpoint: string;
  user: any;
  bienImm: any;

  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();
  motifAnnulationForm = new MotifForm();
  motifRefusForm = new MotifForm();
  images: ImagesBienImmobilier[] = [];

  demandeVisiteId: any;
  demandeVisiteReussie: any;
  listMotifs: Motif[] = [];

  constructor(private demandeVisiteService: DemandeVisiteService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private motifService: MotifService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private caracteristiquesServices: CaracteristiquesService, private pageVisibilityService: PageVisibilityService,
    private userInactivityService: UserInactivityService
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
    this.demandeVisiteReussie = this.activatedRoute.snapshot.queryParams['demandeVisiteReussie'];
    const demandeRequest = localStorage.getItem('demandeRequest');
    if (demandeRequest !== null) {
        localStorage.removeItem('demandeRequest');
    }

    this.initResponsiveOptions();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailDemandeVisite(parseInt(id));
      } else {
        this.listeDemandesVisites(this.numeroDeLaPage, this.elementsParPage);
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

  selectDateHeureVisite(event: any): void {
    this.dateHeureVisiteSelectionne = event;
  }

  listeDemandesVisites(numeroDeLaPage: number, elementsParPage: number) {
    this.demandeVisiteService.getDemandesVisites(numeroDeLaPage, elementsParPage).subscribe(
      (data: Page<DemandeVisite>) => {
        this.demandesVisites = data;
        if (this.demandeVisiteReussie) {
          this.messageService.add({ severity: 'success', summary: 'Demande de visite réussie', detail: 'La demande de visite a été soumise avec succès.' });
        }
      }
    );
  }

  listeMotifs(code: string, creerPar: number): void {
    this.motifService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: Motif[]) => {
        this.listMotifs = data;
      }
    );
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeDemandesVisites(this.numeroDeLaPage, this.elementsParPage);
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  detailDemandeVisite(id: number): void {
    this.demandeVisiteService.findById(id).subscribe(
      (data: DemandeVisite) => {
        this.demandeVisite = data;
        this.getImagesBienImmobilier(this.demandeVisite.publication.bienImmobilier.id);
        if (this.isTypeDeBienSupport(this.demandeVisite.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.demandeVisite.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.demandeVisite.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.demandeVisite.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.demandeVisite.publication.bienImmobilier.id);
        }

        if (this.personneService.estClient(this.user.role.code)) {
          this.listeMotifs(this.demandeVisite.codeDemande, this.demandeVisite.refuserPar);
        } else {
          this.listeMotifs(this.demandeVisite.codeDemande, this.demandeVisite.annulerPar);
        }
      }
    );
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

  afficherPageDetail(id: any): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demande-visite', id]);
  }

  afficherModalRefus(id: number): void {
    this.demandeVisiteId = id;
    this.modalRefusVisible = true;
  }

  afficherModalAnnulation(id: number): void {
    this.demandeVisiteId = id;
    this.modalAnnulationVisible = true;
  }

  //Retour par Url
  voirListe(): void {
    this.affichage = 1;
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-visites'])
  }

  //Retour sans url
  afficherListe(): void {
    this.demandeVisiteReussie = false;
    this.listeDemandesVisites(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  dialogueNotVisible(): void {
    this.modalRefusVisible = false;
    this.modalAnnulationVisible = false;
  }

  enregistrerMotifRefuser(): void {
    this.demandeVisiteService.refuser(this.demandeVisiteId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.detailDemandeVisite(this.demandeVisiteId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demande-visite/' + this.demandeVisiteId);
        this.messageSuccess = "Le demande de visite a été refusée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Refus de la demande de visite confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  enregistrerMotifAnnuler(): void {
    this.demandeVisiteService.annuler(this.demandeVisiteId, this.motifAnnulationForm).subscribe(
      (response) => {
        this.modalAnnulationVisible = false;
        this.detailDemandeVisite(this.demandeVisiteId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demande-visite/' + this.demandeVisiteId);
        this.messageSuccess = "La demande de visite a été annulée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Annulation de la demande de visite confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  afficherPageModifier(id: number): void {
    this.demandeVisiteService.findById(id).subscribe(
      (data: DemandeVisite) => {
        this.dateHeureVisiteSelectionne = new Date(data.dateHeureVisite);
        this.demandeVisite = data;
      }
    );
    this.affichage = 3;
  }

  modifier(id: number): void {
    this.demandeVisite.dateHeureVisite = this.dateHeureVisiteSelectionne;
    this.demandeVisiteService.editDemandeVisite(id, this.demandeVisite).subscribe(
      (response) => {
        this.afficherListe();
        this.messageSuccess = "La demande de visite a été modifiée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Modification de la demande de visite confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  relancer(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir relancer cette demande de visite ?',
      header: "Relance d'une demande de visite",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeVisiteService.relancer(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La demande de visite a été relancée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Relance d\'une demande de visite confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Relance d\'une demande de visite rejetée',
              detail: "Vous avez rejeté la relance de cette demande de visite !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Relance d\'une demande de visite annulée',
              detail: "Vous avez annulé la relance de cette demande de visite !"
            });
            break;
        }
      }
    });
  }

  valider(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider cette demande de visite ?',
      header: "Validation d'une demande de visite",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeVisiteService.valider(id).subscribe(
          (response) => {
            this.detailDemandeVisite(id);
            this.router.navigateByUrl(this.navigateURLBYUSER + '/demande-visite/' + id);
          this.messageSuccess = "La demande de visite a été validée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Validation d\'une demande de visite confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'une demande de visite rejetée',
              detail: "Vous avez rejeté la validation de cette demande de visite !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'une demande de visite annulée',
              detail: "Vous avez annulé la validation de cette demande de visite !"
            });
            break;
        }
      }
    });
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

  afficherCategorie(designation: string): boolean {
    return designation == 'Maison' || designation == 'Villa' ||
    designation == 'Immeuble' || designation == 'Appartement' ||
    designation == 'Chambre salon' || designation == 'Chambre' ||
    designation == 'Bureau';
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
