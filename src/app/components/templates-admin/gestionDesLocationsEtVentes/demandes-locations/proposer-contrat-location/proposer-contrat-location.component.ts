import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proposer-contrat-location',
  templateUrl: './proposer-contrat-location.component.html',
  styleUrls: ['./proposer-contrat-location.component.css']
})
export class ProposerContratLocationComponent implements OnInit, OnDestroy {

  responsiveOptions: any[] | undefined;
  menus: MenuItem[] | undefined;
  activeIndex: number = 0;

  demandeLocation = this.demandeLocationService.demandeLocation;
  APIEndpoint: string;
  user: any;

  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();
  bienImm: any;
  images: ImagesBienImmobilier[] = [];

  contratLocation = this.contratLocationService.contratLocation;

  typesDeContrat: string[] = [];
  typeDeContratSelectionne: any;

  contratLocationStep1Form: any;
  contratLocationStep2Form: any;

  constructor(private demandeLocationService: DemandeLocationService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService, private messageService: MessageService,
    private imagesBienImmobilierService: ImagesBienImmobilierService,
    private contratLocationService: ContratLocationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
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
        this.afficherPageAjoutContrat(parseInt(id));
      }
    });
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-locations']);
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

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
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
      }
    );
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
  afficherCategorie(designation: string): boolean {
    return designation == 'Maison' || designation == 'Villa' ||
    designation == 'Immeuble' || designation == 'Appartement' ||
    designation == 'Chambre salon' || designation == 'Chambre' ||
    designation == 'Bureau';
  }

  ngOnDestroy(): void {

  }

}
