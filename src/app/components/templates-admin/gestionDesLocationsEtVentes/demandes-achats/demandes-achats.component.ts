import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { MotifRejet } from 'src/app/models/MotifRejet';
import { MotifRejetForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetForm';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeAchat } from 'src/app/models/gestionDesLocationsEtVentes/DemandeAchat';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { DemandeAchatService } from 'src/app/services/gestionDesLocationsEtVentes/demande-achat.service';
import { MotifRejetService } from 'src/app/services/motif-rejet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-demandes-achats',
  templateUrl: './demandes-achats.component.html',
  styleUrls: ['./demandes-achats.component.css']
})
export class DemandesAchatsComponent implements OnInit, OnDestroy {

  modalRefusVisible: boolean = false;
  modalAnnulationVisible: boolean = false;
  recherche: string = '';
  affichage = 1;
  responsiveOptions: any[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  demandeAchat = this.demandeAchatService.demandeAchat;
  demandesAchats!: Page<DemandeAchat>;
  APIEndpoint: string;
  user: any;
  bienImm: any;

  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();
  motifAnnulationForm = new MotifRejetForm();
  motifRefusForm = new MotifRejetForm();
  images: ImagesBienImmobilier[] = [];
  demandeAchatForm: any;

  demandeAchatId: any;
  demandeAchatReussie: any;
  listMotifs: MotifRejet[] = [];

  constructor(private demandeAchatService: DemandeAchatService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private motifRejetService: MotifRejetService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private caracteristiquesServices: CaracteristiquesService,
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.demandeAchatReussie = this.activatedRoute.snapshot.queryParams['demandeAchatReussie'];

    this.initResponsiveOptions();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailDemandeAchat(parseInt(id));
      } else {
        this.listeDemandesAchats(this.numeroDeLaPage, this.elementsParPage);
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

  listeDemandesAchats(numeroDeLaPage: number, elementsParPage: number) {
    this.demandeAchatService.getDemandesAchats(numeroDeLaPage, elementsParPage).subscribe(
      (data: Page<DemandeAchat>) => {
        this.demandesAchats = data;
        if (this.demandeAchatReussie) {
          this.messageService.add({ severity: 'success', summary: 'Demande d\'achat réussie', detail: 'La demande d\'achat a été soumise avec succès.' });
        }
      }
    );
  }

  listeMotifs(code: string, creerPar: number): void {
    this.motifRejetService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: MotifRejet[]) => {
        this.listMotifs = data;
      }
    );
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeDemandesAchats(this.numeroDeLaPage, this.elementsParPage);
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  detailDemandeAchat(id: number): void {
    this.demandeAchatService.findById(id).subscribe(
      (data: DemandeAchat) => {
        this.demandeAchat = data;
        this.getImagesBienImmobilier(this.demandeAchat.publication.bienImmobilier.id);
        if (this.isTypeDeBienSupport(this.demandeAchat.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.demandeAchat.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.demandeAchat.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.demandeAchat.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.demandeAchat.publication.bienImmobilier.id);
        }

        if (this.user.role.code == 'ROLE_CLIENT') {
          this.listeMotifs(this.demandeAchat.codeDemande, this.demandeAchat.refuserPar);
        } else {
          this.listeMotifs(this.demandeAchat.codeDemande, this.demandeAchat.annulerPar);
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
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-achats', id]);
  }

  afficherModalRefus(id: number): void {
    this.demandeAchatId = id;
    this.modalRefusVisible = true;
  }

  afficherModalAnnulation(id: number): void {
    this.demandeAchatId = id;
    this.modalAnnulationVisible = true;
  }

  voirListe(): void {
    this.affichage = 1;
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-achats']);
  }

  enregistrerMotifRefuser(): void {
    this.demandeAchatService.refuser(this.demandeAchatId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.voirListe();
        this.messageSuccess = "La demande d'achat a été refusée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Refus de la demande d\'achat confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  dialogueNotVisible(): void {
    this.modalRefusVisible = false;
    this.modalAnnulationVisible = false;
  }

  enregistrerMotifAnnuler(): void {
    this.demandeAchatService.annuler(this.demandeAchatId, this.motifAnnulationForm).subscribe(
      (response) => {
        this.modalAnnulationVisible = false;
        this.voirListe();
        this.messageSuccess = "La demande d'achat a été annulée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Annulation de la demande d\'achat du confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  afficherPageModifier(id: number): void {
    this.demandeAchatService.findById(id).subscribe(
      (data: DemandeAchat) => {
        console.log(data);
        this.demandeAchat = data;
      }
    );
    this.affichage = 3;
  }

  modifier(id: number): void {
    this.demandeAchatService.updateDemandeAchat(id, this.demandeAchat).subscribe(
      (response) => {
        this.voirListe();
        this.messageSuccess = "La demande d'achat a été modifiée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Modification d\'une demande d\'achat confirmée',
          detail: this.messageSuccess
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  relancer(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir relancer cette demande d\'achat ?',
      header: "Relance d'une demande d'achat",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeAchatService.relancer(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La demande d'achat a été relancée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Relance d\'une demande d\'achat confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Relance d\'une demande d\'achat rejetée',
              detail: "Vous avez rejeté la relance de cette demande d'achat !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Relance d\'une demande d\'achat annulée',
              detail: "Vous avez annulé la relance de cette demande d'achat !"
            });
            break;
        }
      }
    });
  }

  valider(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider cette demande d\'achat ?',
      header: "Validation d'une demande d'achat",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeAchatService.valider(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La demande d'achat a été validée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Validation d\'une demande d\'achat confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'une demande d\'achat rejetée',
              detail: "Vous avez rejeté la validation de cette demande d'achat !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'une demande d\'achat annulée',
              detail: "Vous avez annulé la validation de cette demande d'achat !"
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

  afficherCategorie(): boolean {
    return this.bienImm.typeDeBien.designation == 'Maison' ||
    this.bienImm.typeDeBien.designation == 'Villa' ||
    this.bienImm.typeDeBien.designation == 'Immeuble' ||
    this.bienImm.typeDeBien.designation == 'Appartement' ||
    this.bienImm.typeDeBien.designation == 'Chambre salon' ||
    this.bienImm.typeDeBien.designation == 'Chambre' ||
    this.bienImm.typeDeBien.designation == 'Bureau';
  }

  newDemandeAchat(): void {
    this.demandeAchat = new DemandeAchat();
  }

  ngOnDestroy(): void {
  }
}
