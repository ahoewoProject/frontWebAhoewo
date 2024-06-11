import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { ContratVente } from 'src/app/models/gestionDesLocationsEtVentes/ContratVente';
import { Motif } from 'src/app/models/Motif';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { MotifService } from 'src/app/services/motif.service';

@Component({
  selector: 'app-biens-contrats',
  templateUrl: './biens-contrats.component.html',
  styleUrls: ['./biens-contrats.component.css']
})
export class BiensContratsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage: number = 1;

  elementsParPageContratLocation = 5;
  numeroDeLaPageContratLocation = 0;
  elementsParPageContratVente = 5;
  numeroDeLaPageContratVente = 0;

  activeIndex: number =  0;

  codeBien: any;
  contrat: any;
  contratsLocations!: Page<ContratLocation>;
  contratsVentes!: Page<ContratVente>;
  contratBien!: any;
  listMotifs: Motif[] = [];
  delegationGestion =  this.delegationGestionService.delegationGestion;
  user: any;

  constructor(private contratLocationService: ContratLocationService, private contratVenteService: ContratVenteService,
    private motifService: MotifService, private personneService: PersonneService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private bienImmobilierService: BienImmobilierService, private delegationGestionService: DelegationGestionService,
    private bienImmAssocieService: BienImmAssocieService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const codeBien = params.get('codeBien');
      const idContratLocation = params.get('idContratLocation');
      const idContratVente = params.get('idContratVente');

      switch (true) {
        case codeBien !== null:
          this.detailBien(codeBien!);
          this.voirListeContrats(codeBien!);
          if (this.activatedRoute.snapshot.queryParams['activeIndex']) {
            this.activeIndex = this.activatedRoute.snapshot.queryParams['activeIndex'];
          }
          this.affichage = 1;
          break;
        case idContratLocation !== null:
          const idLocationString = idContratLocation!;
          this.afficherPageDetailContratLocation(parseInt(idLocationString, 10));
          break;
        case idContratVente !== null:
          const idVenteString = idContratVente!;
          this.afficherPageDetailContratVente(parseInt(idVenteString, 10));
          break;
        default:
          // Gérer le cas où aucun paramètre pertinent n'est défini
          // Peut-être rediriger vers une page d'erreur ou afficher un message approprié
          break;
      }
    });
  }


  detailBien(codeBien: string): void {
    this.bienImmobilierService.findByCodeBien(codeBien).subscribe(
      (data) => {
        this.contratBien = data;
      }
    )
  }

  performActionBasedOnURL(contratBien: any): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      if (this.isBienSupport(contratBien.typeDeBien.designation)) {
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', contratBien.id]);
      } else {
        this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support/', contratBien.bienImmobilier.id, 'bien-associe', contratBien.id]);
      }
    } else if (segments.includes('bien-delegue')) {
      this.delegationGestionService.findByBienImmobilier(contratBien.id).subscribe(
        (data) => {
          this.delegationGestion = data;

          this.router.navigate([this.navigateURLBYUSER(this.user) + '/delegation-gestion', this.delegationGestion.id], { queryParams: { idBien: this.delegationGestion.bienImmobilier.id } });
        }
      )
    }
  }

  private isBienSupport(designation: string): boolean {
    return designation == 'Terrain' ||
    designation == 'Villa' ||
    designation == 'Maison' ||
    designation == 'Immeuble';
  }

  private isBienAssocie(designation: string): boolean {
    return designation == 'Chambre' ||
    designation == 'Chambre salon' ||
    designation == 'Appartement' ||
    designation == 'Magasin' ||
    designation == 'Bureau' ||
    designation ==  'Boutique';
  }

  afficherContratVente(contratBien: BienImmobilier) {
    return contratBien.typeDeBien.designation == 'Terrain' ||
    contratBien.typeDeBien.designation == 'Villa' ||
    contratBien.typeDeBien.designation == 'Maison' ||
    contratBien.typeDeBien.designation == 'Immeuble';
  }

  afficherContratLocation(contratBien: BienImmobilier) {
    return contratBien.typeDeBien.designation == 'Maison' ||
    contratBien.typeDeBien.designation == 'Immeuble' ||
    contratBien.typeDeBien.designation == 'Villa' ||
    contratBien.typeDeBien.designation == 'Chambre' ||
    contratBien.typeDeBien.designation == 'Chambre salon' ||
    contratBien.typeDeBien.designation == 'Appartement' ||
    contratBien.typeDeBien.designation == 'Magasin' ||
    contratBien.typeDeBien.designation == 'Bureau' ||
    contratBien.typeDeBien.designation ==  'Boutique';
  }

  voirListeContrats(codeBien: string): void {
    this.listeContratsLocationsByCodeBien(codeBien, this.numeroDeLaPageContratLocation, this.elementsParPageContratLocation);
    this.listeContratsVentesByCodeBien(codeBien, this.numeroDeLaPageContratVente, this.elementsParPageContratVente);
  }

  listeContratsLocationsByCodeBien(codeBien: string, numeroDeLaPageContratLocation: number, elementsParPageContatLocation: number): void {
    this.contratLocationService.getContratsLocationsByCodeBien(codeBien, numeroDeLaPageContratLocation, elementsParPageContatLocation).subscribe(
      (response) => {
        this.contratsLocations = response;
      }
    )
  }

  listeContratsVentesByCodeBien(codeBien: string, numeroDeLaPageContratVente: number, elementsParPageContratVente: number): void {
    this.contratVenteService.getContratsVentesByCodeBien(codeBien, numeroDeLaPageContratVente, elementsParPageContratVente).subscribe(
      (response) => {
        this.contratsVentes = response;
      }
    )
  }

  listeMotifs(code: string, creerPar: number): void {
    this.motifService.getMotifsByCodeAndCreerPar(code, creerPar).subscribe(
      (data: Motif[]) => {
        this.listMotifs = data;
      }
    );
  }

  paginationContratVente(event: any) {
    this.numeroDeLaPageContratVente = event.first / event.rows;
    this.elementsParPageContratVente = event.rows;
    this.listeContratsVentesByCodeBien(this.codeBien, this.numeroDeLaPageContratVente, this.elementsParPageContratVente);
  }

  paginationContratLocation(event: any) {
    this.numeroDeLaPageContratLocation = event.first / event.rows;
    this.elementsParPageContratLocation = event.rows;
    this.listeContratsLocationsByCodeBien(this.codeBien, this.numeroDeLaPageContratLocation, this.elementsParPageContratLocation);
  }

  detailContratLocation(id: number): void {
    this.contratLocationService.findById(id).subscribe(
      (response) => {
        this.contrat = response;
        if (this.personneService.estClient(this.user.role.code)) {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.refuserPar);
        } else {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.annulerPar);
        }
      }
    )
  }

  detailContratVente(id: number): void {
    this.contratVenteService.findById(id).subscribe(
      (response) => {
        this.contrat = response;
        if (this.personneService.estClient(this.user.role.code)) {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.refuserPar);
        } else {
          this.listeMotifs(this.contrat.codeContrat, this.contrat.annulerPar);
        }
      }
    )
  }

  afficherPageDetailContratLocation(id: number): void {
    this.detailContratLocation(id);
    this.affichage = 2;
  }

  afficherPageDetailContratVente(id: number): void {
    this.detailContratVente(id);
    this.affichage = 3;
  }

  retourListeContratsByContratLocation(codeBien: string) {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/', codeBien], { queryParams: { activeIndex: 0 }});
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/', codeBien], { queryParams: { activeIndex: 0 }});
    }
  }

  retourListeContratsByContratVente(codeBien: string) {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/', codeBien], { queryParams: { activeIndex: 1 }});
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/', codeBien], { queryParams: { activeIndex: 1 }});
    }
  }

  voirDetailContratLocation(id: number): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrat-location/', id]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrat-location/', id]);
    }
  }

  voirDetailContratVente(id: number): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrat-vente/', id]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrat-vente/', id]);
    }
  }

  telechargerContratLocation(id: number): void {
    this.contratLocationService.telecharger(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });

        // Créer un objet URL pour le fichier PDF
        const fileURL = URL.createObjectURL(file);

        // Ouvrir le PDF dans un nouvel onglet
        window.open(fileURL, '_blank');
      }
    )
  }

  telechargerContratVente(id: number): void {
    this.contratVenteService.telecharger(id).subscribe(
      response => {
        const file = new Blob([response], { type: 'application/pdf' });

        // Créer un objet URL pour le fichier PDF
        const fileURL = URL.createObjectURL(file);

        // Ouvrir le PDF dans un nouvel onglet
        window.open(fileURL, '_blank');
      }
    )
  }

  calculerProchainPaiement(dateDebut: Date, jourSupplementPaiement: number, debutPaiement: number): Date {
    const prochainPaiementDate = new Date(dateDebut);
    prochainPaiementDate.setDate(prochainPaiementDate.getDate() + jourSupplementPaiement);
    prochainPaiementDate.setMonth(prochainPaiementDate.getMonth() + debutPaiement);
    return prochainPaiementDate;
  }

  afficherCategorie(designation: string): boolean {
    return designation == 'Maison' ||
    designation == 'Villa' ||
    designation == 'Immeuble' ||
    designation == 'Appartement' ||
    designation == 'Chambre salon' ||
    designation == 'Chambre' ||
    designation == 'Bureau';
  }

  voirListePlanificationsPaiements(codeContrat: string): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/planifications-paiements/', codeContrat]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/planifications-paiements/', codeContrat]);
    }
  }

  voirListePaiements(codeContrat: string): void {
    const currentURL = this.router.url;
    const segments = currentURL.split('/');

    if (segments.includes('bien')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien/contrats/paiements/', codeContrat]);
    } else if (segments.includes('bien-delegue')) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-delegue/contrats/paiements/', codeContrat]);
    }
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
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
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  ngOnDestroy(): void {

  }

}
