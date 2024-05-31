import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Motif } from 'src/app/models/Motif';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeAchat } from 'src/app/models/gestionDesLocationsEtVentes/DemandeAchat';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { DemandeAchatService } from 'src/app/services/gestionDesLocationsEtVentes/demande-achat.service';
import { MotifService } from 'src/app/services/motif.service';
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
  menus: MenuItem[] | undefined;
  responsiveOptions: any[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  demandeAchat = this.demandeAchatService.demandeAchat;
  demandesAchats!: Page<DemandeAchat>;
  APIEndpoint: string;
  user: any;
  bienImm: any;
  activeIndex: number = 0;

  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();
  motifAnnulationForm = new MotifForm();
  motifRefusForm = new MotifForm();
  images: ImagesBienImmobilier[] = [];
  demandeAchatForm: any;

  demandeAchatId: any;
  demandeAchatReussie: any;
  listMotifs: Motif[] = [];
  contratVenteFormStep1: any;
  contratVenteFormStep2: any;
  contratVenteFormStep3: any;

  contratVente = this.contratVenteService.contratVente;

  constructor(private demandeAchatService: DemandeAchatService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private motifService: MotifService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private caracteristiquesServices: CaracteristiquesService, private contratVenteService: ContratVenteService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.demandeAchatReussie = this.activatedRoute.snapshot.queryParams['demandeAchatReussie'];
    const demandeRequest = localStorage.getItem('demandeRequest');
    if (demandeRequest !== null) {
        localStorage.removeItem('demandeRequest');
    }

    this.initResponsiveOptions();
    this.initContratVenteStep1Form();
    this.initContratVenteStep2Form();
    this.initContratVenteStep3Form();
    if (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.menusOfAgence();
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.menusOfDemarcheur();
    } else {
      this.menusOfOtherUser();
    }

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

  menusOfAgence(): void {
    this.menus = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Agence'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusOfDemarcheur(): void {
    this.menus = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Demarcheur'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  menusOfOtherUser(): void {
    this.menus = [
      {
          label: 'Client'
      },
      {
          label: 'Témoins'
      },
      {
          label: 'Confirmation'
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
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
    this.motifService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: Motif[]) => {
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

  //Afficher liste avec Url
  voirListe(): void {
    this.affichage = 1;
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-achats']);
  }

  //Afficher liste sans url
  afficherListe(): void {
    this.listeDemandesAchats(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  enregistrerMotifRefuser(): void {
    this.demandeAchatService.refuser(this.demandeAchatId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.detailDemandeAchat(this.demandeAchatId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-achats/' + this.demandeAchatId);
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
        this.detailDemandeAchat(this.demandeAchatId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-achats/' + this.demandeAchatId);
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
        this.afficherListe();
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
            this.detailDemandeAchat(id);
            this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-achats/' + id);
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

  afficherPageContrat(id: number): void {
    this.demandeAchatService.findById(id).subscribe(
      (data: DemandeAchat) => {
        this.demandeAchat = data;
        this.contratVente.demandeAchat = this.demandeAchat;
        this.contratVente.prixVente = data.prixAchat;
        this.contratVente.nombreDeTranche = data.nombreDeTranche;
        this.contratVente.fraisDeVisite  = data.publication.fraisDeVisite;
        this.contratVente.commission = data.publication.commission
      }
    )
    this.affichage = 4;
  }

  initContratVenteStep1Form(): void {
    this.contratVenteFormStep1 = new FormGroup({
      prixVente: new FormControl('', [Validators.required]),
      nombreDeTranche: new FormControl('', [Validators.required]),
    })
  }

  get prixVente() {
    return this.contratVenteFormStep1.get('prixVente')
  }

  get nombreDeTranche() {
    return this.contratVenteFormStep1.get('nombreDeTranche')
  }

  resetContratVenteForm(): void {
    this.contratVenteFormStep1.reset();
  }

  initContratVenteStep2Form(): void {
    this.contratVenteFormStep2 = new FormGroup({
      nomPrenomTemoin1Vendeur: new FormControl('', [Validators.required]),
      contactTemoin1Vendeur: new FormControl('', [Validators.required]),
      nomPrenomTemoin2Vendeur: new FormControl(''),
      contactTemoin2Vendeur: new FormControl(''),
      nomPrenomTemoin3Vendeur: new FormControl(''),
      contactTemoin3Vendeur: new FormControl(''),

      nomPrenomTemoin1Acheteur: new FormControl('', [Validators.required]),
      contactTemoin1Acheteur: new FormControl('', [Validators.required]),
      nomPrenomTemoin2Acheteur: new FormControl(''),
      contactTemoin2Acheteur: new FormControl(''),
      nomPrenomTemoin3Acheteur: new FormControl(''),
      contactTemoin3Acheteur: new FormControl(''),
    })
  }

  get nomPrenomTemoin1Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin1Vendeur')
  }

  get contactTemoin1Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin1Vendeur')
  }

  get nomPrenomTemoin2Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin2Vendeur')
  }

  get contactTemoin2Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin2Vendeur')
  }

  get nomPrenomTemoin3Vendeur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin3Vendeur')
  }

  get contactTemoin3Vendeur() {
    return this.contratVenteFormStep2.get('contactTemoin3Vendeur')
  }

  get nomPrenomTemoin1Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin1Acheteur')
  }

  get contactTemoin1Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin1Acheteur')
  }

  get nomPrenomTemoin2Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin2Acheteur')
  }

  get contactTemoin2Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin2Acheteur')
  }

  get nomPrenomTemoin3Acheteur() {
    return this.contratVenteFormStep2.get('nomPrenomTemoin3Acheteur')
  }

  get contactTemoin3Acheteur() {
    return this.contratVenteFormStep2.get('contactTemoin3Acheteur')
  }

  initContratVenteStep3Form(): void {
    this.contratVenteFormStep3 = new FormGroup({
      commission: new FormControl(''),
      fraisDeVisite: new FormControl(''),
    })
  }

  get commission() {
    return this.contratVenteFormStep3.get('commission');
  }

  get fraisDeVisite() {
    return this.contratVenteFormStep3.get('fraisDeVisite');
  }

  etape1(): void {
    this.activeIndex = 0;
  }

  etape2(): void {
    this.activeIndex = 1;
  }

  etape3(): void {
    this.activeIndex = 2;
  }

  etape4(): void {
    this.activeIndex = 3;
  }

  ajouterContratVente(): void {
    this.contratVente.bienImmobilier = this.demandeAchat.publication.bienImmobilier;
    this.contratVente.client = this.demandeAchat.client;
    if (this.demandeAchat.publication.bienImmobilier.estDelegue) {
      this.contratVente.proprietaire = this.demandeAchat.publication.bienImmobilier.personne;

      if (this.demandeAchat.publication.agenceImmobiliere) {
        this.contratVente.agenceImmobiliere = this.demandeAchat.publication.agenceImmobiliere;
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.demandeAchat.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratVente.demarcheur = this.demandeAchat.publication.personne
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.demandeAchat.publication.personne.role.code == 'ROLE_GERANT') {
        this.contratVente.gerant = this.demandeAchat.publication.personne
      }
    } else {
      if (this.demandeAchat.publication.agenceImmobiliere) {
        this.contratVente.agenceImmobiliere = this.demandeAchat.publication.agenceImmobiliere;
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.demandeAchat.publication.personne.role.code == 'ROLE_DEMARCHEUR') {
        this.contratVente.demarcheur = this.demandeAchat.publication.personne
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.demandeAchat.publication.personne.role.code == 'ROLE_PROPRIETAIRE') {
        this.contratVente.proprietaire = this.demandeAchat.publication.bienImmobilier.personne;
      }
    }
    this.contratVenteService.ajouterContratVente(this.contratVente).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats'], { queryParams: { ajoutContratVenteReussie: true } });
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Echec d\'ajout du contrat de vente',
            detail: 'Le contrat de vente n\' a pas été ajouté !'
          })
        }
      },
      (error) => {
        console.log(error)
        if (error.error == "Un contrat de vente existe déjà pour cette demande d'achat.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout du contrat de vente non réussie',
            detail: error.error
          });
        } else if (error.error == "Un contrat de vente est déjà validé pour ce bien immobilier.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout du contrat de non réussie',
            detail: error.error
          });
        }
      }
    )
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

  newDemandeAchat(): void {
    this.demandeAchat = new DemandeAchat();
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
