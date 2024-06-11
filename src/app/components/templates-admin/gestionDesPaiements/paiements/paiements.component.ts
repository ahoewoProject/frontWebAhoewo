import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Paiement } from 'src/app/models/gestionDesPaiements/Paiement';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { ContratVenteService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-vente.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paiements',
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css']
})
export class PaiementsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  elementsParPage = 5;
  numeroDeLaPage = 0;

  contratLocation = this.contratLocationService.contratLocation;
  contratVente = this.contratVenteService.contratVente;
  paiements!: Page<Paiement>
  paiement = this.paiementService.paiement;
  messageSuccess: string | null = null;
  user: any;
  paiementReussi: any;
  APIEndpoint: any;

  constructor(private paiementService: PaiementService, private router: Router,
    private activatedRoute: ActivatedRoute, private personneService: PersonneService,
    private messageService: MessageService, private contratVenteService: ContratVenteService,
    private contratLocationService: ContratLocationService, private confirmationService: ConfirmationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.paiementReussi = this.activatedRoute.snapshot.queryParams['paiementReussi'];
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailPaiement(parseInt(id));
      } else {
        this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  listePaiements(numeroDeLaPage: number, elementsParPage: number): void {
    this.paiementService.getPaiements(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.paiements = response;
        if (this.paiementReussi) {
          this.messageService.add({ severity: 'success', summary: 'Paiement réussi', detail: 'Le paiement a été effectué avec succès.' });
        }
      }
    )
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  retour(): void {
    this.affichage = 1;
    this.listePaiements(this.numeroDeLaPage, this.elementsParPage);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiements']);
  }

  detailPaiement(id: number): void {
    this.paiementService.findById(id).subscribe(
      (response) => {
        this.paiement = response;
        if (this.paiement.planificationPaiement.typePlanification == 'Paiement de location') {
          this.detailContratLocation(this.paiement.planificationPaiement.contrat.id);
        } else {
          this.detailContratVente(this.paiement.planificationPaiement.contrat.id);
        }
      }
    )
  }

  detailContratVente(id: number) {
    this.contratVenteService.findById(id).subscribe(
      (data) => {
        this.contratVente = data;
      }
    )
  }

  detailContratLocation(id: number) {
    this.contratLocationService.findById(id).subscribe(
      (data) => {
        this.contratLocation = data;
      }
    )
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiement/' + id]);
  }

  validerPaiement(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir valider ce paiement ?',
      header: "Validation d'un paiement",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.paiementService.validerPaiement(id).subscribe(
          (response) => {
            this.detailPaiement(id);
            this.router.navigateByUrl(this.navigateURLBYUSER + '/paiement/' + id);
            this.messageSuccess = "Le paiement a été validé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Validation d\'un paiement confirmée',
              detail: this.messageSuccess
            })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation d\'un paiement rejetée',
              detail: "Vous avez rejeté la validation de ce paiement !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation d\'un paiement annulée',
              detail: "Vous avez annulé la validation de ce paiement !"
            });
            break;
        }
      }
    });
  }
  afficherCategorie(categorie: string): boolean {
    return categorie == 'Maison' ||
    categorie == 'Villa' ||
    categorie == 'Immeuble' ||
    categorie == 'Appartement' ||
    categorie == 'Chambre salon' ||
    categorie == 'Chambre' ||
    categorie == 'Bureau';
  }

  telechargerFichePaiement(id: number): void {
    this.paiementService.telechargerFichePaiement(id).subscribe(
      (response) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
      }
    )
  }

  telechargerPreuvePaiement(id: number): void {
    this.paiementService.telechargerPreuvePaiement(id).subscribe(
      (response) => {
        const blob = new Blob([response]);

        // Créer un FileReader
        const reader = new FileReader();

        // Écouter l'événement onloadend pour récupérer les premiers octets du fichier
        reader.onloadend = () => {
          // Récupérer les premiers octets du fichier
          const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
          let fileType = '';
          for (let i = 0; i < arr.length; i++) {
            fileType += arr[i].toString(16);
          }

          // Déterminer le type de fichier en fonction des premiers octets
          let mimeType = '';
          switch (fileType) {
            case '89504e47':
              mimeType = 'image/png';
              break;
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
              mimeType = 'image/jpeg';
              break;
            case '25504446':
              mimeType = 'application/pdf';
              break;
            default:
              // Si le type de fichier n'est pas reconnu, définir le type par défaut
              mimeType = 'application/octet-stream';
              break;
          }

          // Créer un Blob avec le bon type MIME
          const file = new Blob([response], { type: mimeType });

          // Créer un URL pour le Blob
          const fileUrl = URL.createObjectURL(file);

          // Ouvrir le fichier dans un nouvel onglet
          window.open(fileUrl, '_blank');
        };

        // Lire les premiers octets du Blob
        reader.readAsArrayBuffer(blob);
      }
    );
  }

  afficherBoutonSiBienDelegue(estDelegue: boolean): boolean {
    if (this.user.role.code === 'ROLE_PROPRIETAIRE') {
      return !estDelegue;
    } else if (
      this.user.role.code === 'ROLE_DEMARCHEUR' ||
      this.user.role.code === 'ROLE_RESPONSABLE' ||
      this.user.role.code === 'ROLE_GERANT' ||
      this.user.role.code === 'ROLE_AGENTIMMOBILIER'
    ) {
      return true;
    }
    return false; // Si aucun des rôles n'est trouvé, retourner false par défaut
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

  ngOnDestroy(): void {

  }

}
