import { BienImmobilier } from './../../../../models/gestionDesBiensImmobiliers/BienImmobilier';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Confort } from 'src/app/models/gestionDesBiensImmobiliers/Confort';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
import { Divertissement } from 'src/app/models/gestionDesBiensImmobiliers/Divertissement';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Utilitaire } from 'src/app/models/gestionDesBiensImmobiliers/Utilitaire';
import { Personne } from 'src/app/models/gestionDesComptes/Personne';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { ConfortService } from 'src/app/services/gestionDesBiensImmobiliers/confort.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { DivertissementService } from 'src/app/services/gestionDesBiensImmobiliers/divertissement.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { UtilitaireService } from 'src/app/services/gestionDesBiensImmobiliers/utilitaire.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delegations-gestions',
  templateUrl: './delegations-gestions.component.html',
  styleUrls: ['./delegations-gestions.component.css']
})
export class DelegationsGestionsComponent implements OnInit {

  image: any;
  responsiveOptions: any[] | undefined;
  recherche: string = '';
  user: any;
  affichage = 1;
  visibleAddForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  delegationGestion = this.delegationGestionService.delegationGestion;
  delegationGestions : DelegationGestion[] = [];
  confort = new Confort();
  divertissement = new Divertissement();
  utilitaire = new Utilitaire();
  images: ImagesBienImmobilier[] = [];
  gestionnaires: Personne[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  APIEndpoint: string;
  delegationReussie: any;

  constructor(private delegationGestionService: DelegationGestionService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private bienImmobilierService: BienImmobilierService,
    private confortService: ConfortService,
    private utilitaireService: UtilitaireService,
    private divertissementService: DivertissementService,
    private confirmationService: ConfirmationService,
    private imagesBienImmobilierService: ImagesBienImmobilierService,
    private activatedRoute: ActivatedRoute
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.delegationReussie = this.activatedRoute.snapshot.queryParamMap.get('delegationReussie') || '';
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

    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.listeDelegationGestionProprietaire();
      this.messageService.add({ severity: 'success', summary: 'Délagation de gestion réussie', detail: 'Le bien correspondant a été délégué avec succès.' });
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR' || this.user.role.code == 'ROLE_GERANT') {
      this.listeDelegationGestionGestionnaire();
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeDelegationsGestionsOfAgencesByResponsable();
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeDelegationsGestionsOfAgencesByAgent();
    }
  }

  premiereImageDuBien(bienId: any) {
    this.bienImmobilierService.getPremiereImage(bienId).subscribe(
      (response: any) => {
        this.image = response;
      },
      (error) => {
        if (error.status === 404) {
          this.image = null;
        }
      }
    );
  }

  listeDelegationGestionProprietaire(): void {
    this.delegationGestionService.getAllByProprietaire().subscribe(
      (response) => {
        this.delegationGestions = response;
        this.delegationGestions.forEach((delegationGestion) => {
          this.premiereImageDuBien(delegationGestion.bienImmobilier.id);
        });
        if (this.delegationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Délagation de gestion réussie', detail: 'Le bien correspondant a été délégué avec succès.' });
        }
      }
    );
  }

  listeDelegationGestionGestionnaire(): void {
    this.delegationGestionService.getAllByGestionnaire().subscribe(
      (response) => {
        this.delegationGestions = response;
        this.delegationGestions.forEach((delegationGestion) => {
          this.premiereImageDuBien(delegationGestion.bienImmobilier.id);
        });
      }
    );
  }

  listeDelegationsGestionsOfAgencesByResponsable(): void {
    this.delegationGestionService.getDelegationsGestionsOfAgencesByResponsable().subscribe(
      (response) => {
        this.delegationGestions = response;
        this.delegationGestions.forEach((delegationGestion) => {
          this.premiereImageDuBien(delegationGestion.bienImmobilier.id);
        });
      }
    );
  }

  listeDelegationsGestionsOfAgencesByAgent(): void {
    this.delegationGestionService.getDelegationsGestionsOfAgencesByAgent().subscribe(
      (response) => {
        this.delegationGestions = response;
        this.delegationGestions.forEach((delegationGestion) => {
          this.premiereImageDuBien(delegationGestion.bienImmobilier.id);
        });
      }
    );
  }

  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id)
    .subscribe((response) => {
      this.images = response;
      console.log(response);
      }
    );
  }

  // Récupération des delegation de gestion de la page courante
  get delegationGestionsParPage(): any[] {
    const startIndex = this.pageActuelle;
    const endIndex = startIndex + this.elementsParPage;
    return this.delegationGestions.slice(startIndex, endIndex);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.listeDelegationGestionProprietaire();
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR' || this.user.role.code == 'ROLE_GERANT') {
      this.listeDelegationGestionGestionnaire();
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeDelegationsGestionsOfAgencesByResponsable();
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeDelegationsGestionsOfAgencesByAgent();
    }
  }

  voirListe(): void {
    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.listeDelegationGestionProprietaire();
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR' || this.user.role.code == 'ROLE_GERANT') {
      this.listeDelegationGestionGestionnaire();
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeDelegationsGestionsOfAgencesByResponsable();
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listeDelegationsGestionsOfAgencesByAgent();
    }
    this.delegationReussie = false;
    this.affichage = 1;
  }

  detailDelegationGestion(id: number): void {
    console.log(id)
    this.delegationGestionService.findById(id).subscribe(
      (response) => {
        this.delegationGestion = response;
        if (response.bienImmobilier.typeDeBien.designation !== 'Terrains') {
          this.detailConfortParBienImmobilier(response.bienImmobilier.id);
          this.detailDivertissementParBienImmobilier(response.bienImmobilier.id);
          this.detailUtilitaireParBienImmobilier(response.bienImmobilier.id);
        }
      }
    );
  }

  detailConfortParBienImmobilier(id: number): void {
    this.confortService.getConfortByBienImmobilier(id).subscribe(
      (response) => {
        this.confort = response;
      }
    );
  }

  detailDivertissementParBienImmobilier(id: number): void {
    this.divertissementService.getDivertissementByBienImmobilier(id).subscribe(
      (response) => {
        this.divertissement = response;
      }
    );
  }

  detailUtilitaireParBienImmobilier(id: number): void {
    this.utilitaireService.getUtilitaireByBienImmobilier(id).subscribe(
      (response) => {
        this.utilitaire = response;
      }
    );
  }

  afficherPageDetail(idDelegationGestion: number, idBienImmobilier: number): void {
    this.getImagesBienImmobilier(idBienImmobilier)
    this.detailDelegationGestion(idDelegationGestion);
    this.affichage = 2;
  }


  supprimerDelegationGestion(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir supprimer cette délégation de gestion ?',
      header: "Suppression d'une délégation de gestion de bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.deleteById(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La délégation de gestion de bien a été supprimé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Suppression de la délégation de gestion de bien confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Suppression de la délégation de gestion d\'un bien rejetée',
              detail: "Vous avez rejeté la suppression de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Suppression de la délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé la suppression de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

  accepterDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir accepter la délégation de la gestion de ce bien ?',
      header: "Acceptation de la délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.accepterDelegationGestion(id).subscribe(
        (response) => {
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La délégation de la gestion de ce bien a été accepté avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Acceptation de la délégation de gestion d\'un bien confirmée',
            detail: this.messageSuccess
          });
        },
        error => {
          if (error.status == 400) {
            this.messageErreur = "Impossible d'accepter cette délégation de gestion car ce bien est délégué à un autre utilisateur !"
            this.messageService.add({
              severity: 'warn',
              summary: 'Acceptation de la délégation de gestion impossible',
              detail: this.messageErreur
            })
          } else {
            this.messageErreur = "Une erreur s'est produite lors de l'acceptation de la délégation de gestion !"
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur lors de l\'acceptation de la délégation de gestion',
              detail: this.messageErreur
            })
          }
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Acceptation de la délégation de gestion d\'un bien rejetée',
              detail: "Vous avez rejeté l'acceptation de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Acceptation de la délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé l'acceptation de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

  refuserDelegationGestion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir refuser la délégation de la gestion de ce bien ?',
      header: "Refus de la délégation de gestion d'un bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delegationGestionService.refuserDelegationGestion(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La délégation de la gestion de ce bien a été refusé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Refus de la délégation de gestion d\'un bien confirmé',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Refus de la délégation de gestion d\'un bien rejeté',
              detail: "Vous avez rejeté le refus de la délégation de gestion de ce bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Refus de la délégation de gestion d\'un bien annulée',
              detail: "Vous avez annulé le refus de la délégation de gestion de ce bien !"
            });
            break;
        }
      }
    });
  }

}
