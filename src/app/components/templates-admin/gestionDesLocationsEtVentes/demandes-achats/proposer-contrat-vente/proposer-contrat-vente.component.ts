import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { DemandeAchat } from 'src/app/models/gestionDesLocationsEtVentes/DemandeAchat';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { DemandeAchatService } from 'src/app/services/gestionDesLocationsEtVentes/demande-achat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proposer-contrat-vente',
  templateUrl: './proposer-contrat-vente.component.html',
  styleUrls: ['./proposer-contrat-vente.component.css']
})
export class ProposerContratVenteComponent implements OnInit, OnDestroy {

  menus: MenuItem[] | undefined;
  responsiveOptions: any[] | undefined;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  demandeAchat = this.demandeAchatService.demandeAchat;
  APIEndpoint: string;
  user: any;
  bienImm: any;
  activeIndex: number = 0;

  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  images: ImagesBienImmobilier[] = [];

  contratVenteFormStep1: any;
  contratVenteFormStep2: any;
  contratVenteFormStep3: any;

  contratVente = this.contratVenteService.contratVente;

  constructor(private demandeAchatService: DemandeAchatService, private activatedRoute: ActivatedRoute,
    private router: Router, private personneService: PersonneService,
    private messageService: MessageService, private contratVenteService: ContratVenteService
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
    this.initContratVenteStep1Form();
    this.initContratVenteStep2Form();
    this.initContratVenteStep3Form();
    if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAgentImmobilier(this.user.role.code)) {
      this.menusOfAgence();
    } else if (this.personneService.estDemarcheur(this.user.role.code)) {
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
        this.afficherPageContrat(parseInt(id));
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

  //Afficher liste avec Url
  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/demandes-achats']);
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
        this.personneService.estDemarcheur(this.demandeAchat.publication.personne.role.code)) {
        this.contratVente.demarcheur = this.demandeAchat.publication.personne
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.personneService.estGerant(this.demandeAchat.publication.personne.role.code)) {
        this.contratVente.gerant = this.demandeAchat.publication.personne
      }
    } else {
      if (this.demandeAchat.publication.agenceImmobiliere) {
        this.contratVente.agenceImmobiliere = this.demandeAchat.publication.agenceImmobiliere;
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.personneService.estDemarcheur(this.demandeAchat.publication.personne.role.code)) {
        this.contratVente.demarcheur = this.demandeAchat.publication.personne
      } else if (this.demandeAchat.publication.personne &&
        this.demandeAchat.publication.personne.role &&
        this.personneService.estProprietaire(this.demandeAchat.publication.personne.role.code)) {
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

  ngOnDestroy(): void {

  }

}
