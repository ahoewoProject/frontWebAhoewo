import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Motif } from 'src/app/models/Motif';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeLocation } from 'src/app/models/gestionDesLocationsEtVentes/DemandeLocation';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { DemandeLocationService } from 'src/app/services/gestionDesLocationsEtVentes/demande-location.service';
import { MotifService } from 'src/app/services/motif.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-demandes-locations',
  templateUrl: './demandes-locations.component.html',
  styleUrls: ['./demandes-locations.component.css']
})
export class DemandesLocationsComponent implements OnInit, OnDestroy {

  modalRefusVisible: boolean = false;
  modalAnnulationVisible: boolean = false;
  recherche: string = '';
  affichage = 1;
  responsiveOptions: any[] | undefined;
  menus: MenuItem[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;
  activeIndex: number = 0;

  demandeLocation = this.demandeLocationService.demandeLocation;
  demandesLocations!: Page<DemandeLocation>;
  APIEndpoint: string;
  user: any;

  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();
  bienImm: any;
  motifAnnulationForm = new MotifForm();
  motifRefusForm = new MotifForm();
  images: ImagesBienImmobilier[] = [];

  contratLocation = this.contratLocationService.contratLocation;

  demandeLocationId: any;
  demandeLocationReussie: any;
  listMotifs: Motif[] = [];
  typesDeContrat: string[] = [];
  typeDeContratSelectionne: any;

  contratLocationStep1Form: any;
  contratLocationStep2Form: any;

  constructor(private demandeLocationService: DemandeLocationService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private motifService: MotifService, private imagesBienImmobilierService: ImagesBienImmobilierService,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private caracteristiquesServices: CaracteristiquesService, private contratLocationService: ContratLocationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.demandeLocationReussie = this.activatedRoute.snapshot.queryParams['demandeLocationReussie'];
    const demandeRequest = localStorage.getItem('demandeRequest');
    if (demandeRequest !== null) {
        localStorage.removeItem('demandeRequest');
    }

    this.initResponsiveOptions();
    if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.menusOfAgence();
    } else if (this.personneService.estDemarcheur(this.user.role.code)) {
      this.menusOfDemarcheur();
    } else {
      this.menusOfOtherUser();
    }
    this.initActivatedRoute();
    this.listeTypesDeContrat();
    this.initContratLocationStep1Form();
    this.initContratLocationStep2Form();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailDemandeLocation(parseInt(id));
      } else {
        this.listeDemandesLocations(this.numeroDeLaPage, this.elementsParPage);
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
          label: 'Confirmation'
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  listeTypesDeContrat(): void {
    this.typesDeContrat = ['Contrat de bail habitation', 'Contrat de bail construction'];
    this.typeDeContratSelectionne = this.typesDeContrat[0];
  }

  initContratLocationStep1Form(): void {
    this.contratLocationStep1Form = new FormGroup({
      typeContrat: new FormControl('', [Validators.required]),
      loyer: new FormControl('', [Validators.required]),
      avance: new FormControl(''),
      caution: new FormControl(''),
      jourSupplementPaiement: new FormControl(''),
      debutPaiement: new FormControl('', [Validators.required]),
      dateDebut: new FormControl('', [Validators.required]),
      dateFin: new FormControl(''),
    })
  }

  initContratLocationStep2Form(): void {
    this.contratLocationStep2Form = new FormGroup({
      commission: new FormControl(''),
      fraisDeVisite: new FormControl(''),
    })
  }

  get typeContrat() {
    return this.contratLocationStep1Form.get('typeContrat');
  }

  get loyer() {
    return this.contratLocationStep1Form.get('loyer');
  }

  get avance() {
    return this.contratLocationStep1Form.get('avance');
  }

  get caution() {
    return this.contratLocationStep1Form.get('caution');
  }

  get jourSupplementPaiement() {
    return this.contratLocationStep1Form.get('jourSupplementPaiement');
  }

  get debutPaiement() {
    return this.contratLocationStep1Form.get('debutPaiement');
  }

  get dateDebut() {
    return this.contratLocationStep1Form.get('dateDebut');
  }

  get dateFin() {
    return this.contratLocationStep1Form.get('dateFin');
  }

  get commission() {
    return this.contratLocationStep2Form.get('commission');
  }

  get fraisDeVisite() {
    return this.contratLocationStep2Form.get('fraisDeVisite');
  }

  calculerProchainPaiement(dateDebut: Date, jourSupplementPaiement: number, debutPaiement: number): Date {
    const prochainPaiementDate = new Date(dateDebut);
    prochainPaiementDate.setDate(prochainPaiementDate.getDate() + jourSupplementPaiement);
    prochainPaiementDate.setMonth(prochainPaiementDate.getMonth() + debutPaiement);
    return prochainPaiementDate;
  }

  resetContratLocationStep1Form(): void {
    this.contratLocationStep1Form.reset();
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

  listeDemandesLocations(numeroDeLaPage: number, elementsParPage: number) {
    this.demandeLocationService.getDemandesLocations(numeroDeLaPage, elementsParPage).subscribe(
      (data: Page<DemandeLocation>) => {
        this.demandesLocations = data;
        if (this.demandeLocationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Demande de location réussie', detail: 'La demande de location a été soumise avec succès.' });
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
    this.listeDemandesLocations(this.numeroDeLaPage, this.elementsParPage);
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  detailDemandeLocation(id: number): void {
    this.demandeLocationService.findById(id).subscribe(
      (data: DemandeLocation) => {
        this.demandeLocation = data;
        this.getImagesBienImmobilier(this.demandeLocation.publication.bienImmobilier.id);
        if (this.isTypeDeBienSupport(this.demandeLocation.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.demandeLocation.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.demandeLocation.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.demandeLocation.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.demandeLocation.publication.bienImmobilier.id);
        }

        if (this.personneService.estClient(this.user.role.code)) {
          this.listeMotifs(this.demandeLocation.codeDemande, this.demandeLocation.creerPar);
        } else {
          this.listeMotifs(this.demandeLocation.codeDemande, this.demandeLocation.client.id);
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
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-locations', id]);
  }

  afficherModalRefus(id: number): void {
    this.demandeLocationId = id;
    this.modalRefusVisible = true;
  }

  afficherModalAnnulation(id: number): void {
    this.demandeLocationId = id;
    this.modalAnnulationVisible = true;
  }

  //Afficher liste avec url
  voirListe(): void {
    this.affichage = 1;
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-locations'])
  }

  //Afficher liste sans url
  afficherListe(): void {
    this.listeDemandesLocations(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  dialogueNotVisible(): void {
    this.modalRefusVisible = false;
    this.modalAnnulationVisible = false;
  }

  enregistrerMotifRefuser(): void {
    this.demandeLocationService.refuser(this.demandeLocationId, this.motifRefusForm).subscribe(
      (response) => {
        this.modalRefusVisible = false;
        this.detailDemandeLocation(this.demandeLocationId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-locations/' + this.demandeLocationId);
        this.messageSuccess = "La demande de location a été refusée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Refus de la demande de location confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  enregistrerMotifAnnuler(): void {
    this.demandeLocationService.annuler(this.demandeLocationId, this.motifAnnulationForm).subscribe(
      (response) => {
        this.modalAnnulationVisible = false;
        this.detailDemandeLocation(this.demandeLocationId);
        this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-locations/' + this.demandeLocationId);
        this.messageSuccess = "La demande de location a été annulée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Annulation de la demande de location confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  afficherPageModifier(id: number): void {
    this.demandeLocationService.findById(id).subscribe(
      (data: DemandeLocation) => {
        this.demandeLocation = data;
      }
    );
    this.affichage = 3;
  }

  modifier(id: number): void {
    this.demandeLocationService.editDemandeLocation(id, this.demandeLocation).subscribe(
      (response) => {
        this.afficherListe();
        this.messageSuccess = "La demande de location a été modifiée avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Modification de la demande de location confirmée',
          detail: this.messageSuccess
        });
      }
    );
  }

  relancer(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir relancer cette demande de location ?',
      header: "Relance d'une demande de location",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeLocationService.relancer(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La demande de location a été relancée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Relance d\'une demande de location confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Relance d\'une demande de location rejetée',
              detail: "Vous avez rejeté la relance de cette demande de location!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Relance d\'une demande de location annulée',
              detail: "Vous avez annulé la relance de cette demande de location !"
            });
            break;
        }
      }
    });
  }

  valider(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider cette demande de location ?',
      header: "Validation d'une demande de location",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeLocationService.valider(id).subscribe(
          (response) => {
          this.detailDemandeLocation(id);
          this.router.navigateByUrl(this.navigateURLBYUSER + '/demandes-locations/' + id);
          this.messageSuccess = "La demande de location a été validée avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Validation d\'une demande de location confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'une demande de location rejetée',
              detail: "Vous avez rejeté la validation de cette demande de location!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'une demande de location annulée',
              detail: "Vous avez annulé la validation de cette demande de location !"
            });
            break;
        }
      }
    });
  }

  afficherPageAjoutContrat(id: number): void {
    this.demandeLocationService.findById(id).subscribe(
      (data: DemandeLocation) => {
        this.demandeLocation = data;
        this.contratLocation.client = this.demandeLocation.client;
        this.contratLocation.demandeLocation = this.demandeLocation;
        this.contratLocation.loyer = this.demandeLocation.prixDeLocation;
        this.contratLocation.avance = this.demandeLocation.avance;
        this.contratLocation.caution = this.demandeLocation.caution;
        this.contratLocation.commission = this.demandeLocation.publication.commission;
        this.contratLocation.fraisDeVisite = this.demandeLocation.publication.fraisDeVisite;
        console.log(data)
      }
    );
    this.affichage = 4;
  }

  ajouterContratLocation(): void {
    this.contratLocation.typeContrat = this.typeDeContratSelectionne;
    this.contratLocation.bienImmobilier = this.demandeLocation.publication.bienImmobilier;
    if (this.demandeLocation.publication.bienImmobilier.estDelegue) {
      this.contratLocation.proprietaire = this.demandeLocation.publication.bienImmobilier.personne;

      if (this.demandeLocation.publication.agenceImmobiliere) {
        this.contratLocation.agenceImmobiliere = this.demandeLocation.publication.agenceImmobiliere;
      } else if (this.demandeLocation.publication.personne &&
        this.demandeLocation.publication.personne.role &&
        this.personneService.estDemarcheur(this.demandeLocation.publication.personne.role.code)) {
        this.contratLocation.demarcheur = this.demandeLocation.publication.personne
      } else if (this.demandeLocation.publication.personne &&
        this.demandeLocation.publication.personne.role &&
        this.personneService.estGerant(this.demandeLocation.publication.personne.role.code)) {
        this.contratLocation.gerant = this.demandeLocation.publication.personne
      }
    } else {
      if (this.demandeLocation.publication.agenceImmobiliere) {
        this.contratLocation.agenceImmobiliere = this.demandeLocation.publication.agenceImmobiliere;
      } else if (this.demandeLocation.publication.personne &&
        this.demandeLocation.publication.personne.role &&
        this.personneService.estDemarcheur(this.demandeLocation.publication.personne.role.code)) {
        this.contratLocation.demarcheur = this.demandeLocation.publication.personne
      } else if (this.demandeLocation.publication.personne &&
        this.demandeLocation.publication.personne.role &&
        this.personneService.estProprietaire(this.demandeLocation.publication.personne.role.code)) {
        this.contratLocation.proprietaire = this.demandeLocation.publication.bienImmobilier.personne;
      }
    }
    this.contratLocationService.ajouterContratLocation(this.contratLocation).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/contrats'], { queryParams: { ajoutContratLocationReussie: true } });
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Echec d\'ajout du contrat de location',
            detail: 'Le contrat de location n\' a pas été ajouté !'
          })
        }
      },
      (error) => {
        if (error.error == "Un contrat de location existe déjà pour cette demande de location.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout du contrat de location non réussie',
            detail: error.error
          });
        } else if (error.error == "Un contrat de location est déjà en cours pour ce bien immobilier.") {
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
  }

}
