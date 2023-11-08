import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { DelegationGestion } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestion';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Personne } from 'src/app/models/gestionDesComptes/Personne';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delegations-gestions',
  templateUrl: './delegations-gestions.component.html',
  styleUrls: ['./delegations-gestions.component.css']
})
export class DelegationsGestionsComponent implements OnInit {

  gestionnaireSelectionne!: Personne;
  bienImmobilierSelectionne!: BienImmobilier;
  responsiveOptions: any[] | undefined;
  recherche: string = '';
  user: any;
  affichage = 1;
  visibleAddForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  delegationGestion = this.delegationGestionService.delegationGestion;
  delegationGestions : DelegationGestion[] = [];
  biensImmobiliers : BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  gestionnaires: Personne[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  APIEndpoint: string;
  delegationGestionForm: any;

  constructor(private delegationGestionService: DelegationGestionService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private bienImmobilierService: BienImmobilierService,
    private confirmationService: ConfirmationService,
    private imagesBienImmobilierService: ImagesBienImmobilierService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
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
    if(this.user.role.code == 'ROLE_PROPRIETAIRE'){
      this.listeDelegationGestionProprietaire();
      this.listeBiensImmobiliersParProprietaire();
      this.listeAgentImmobilierEtDemarcheur();
    }else{
      this.listeDelegationGestionGestionnaire();
    }
    this.initDelegationGestionForm();
  }

  initDelegationGestionForm(): void{
    this.delegationGestionForm = new FormGroup({
      gestionnaire: new FormControl('', [Validators.required]),
      bienImmobilier: new FormControl('', [Validators.required]),
    })
  }

  listeDelegationGestionProprietaire(): void{
    this.delegationGestionService.getAllByProprietaire().subscribe(
      (response) => {
        this.delegationGestions = response;
      }
    );
  }

  listeDelegationGestionGestionnaire(): void{
    this.delegationGestionService.getAllByGestionnaire().subscribe(
      (response) => {
        this.delegationGestions = response;
      }
    );
  }

  listeBiensImmobiliersParProprietaire(){
    this.bienImmobilierService.getAllByProprietaire().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  listeAgentImmobilierEtDemarcheur(): void {
    this.personneService.listeAgentImmobilierEtDemarcheur().subscribe(
      (response) => {
        this.gestionnaires = response;
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

    if(this.user.role.code == 'ROLE_PROPRIETAIRE'){
      this.listeDelegationGestionProprietaire();
    }else{
      this.listeDelegationGestionGestionnaire();
    }
  }

  voirListe(): void{

    if(this.user.role.code == 'ROLE_PROPRIETAIRE'){
      this.listeDelegationGestionProprietaire();
    }else{
      this.listeDelegationGestionGestionnaire();
    }
    this.delegationGestionForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.delegationGestion = new DelegationGestion();
  }

  detailDelegationGestion(id: number): void {
    console.log(id)
    this.delegationGestionService.findById(id).subscribe(
      (response) => {
        this.delegationGestion = response;
      }
    );
  }

  afficherPageDetail(idDelegationGestion: number, idBienImmobilier: number): void {
    this.getImagesBienImmobilier(idBienImmobilier)
    this.detailDelegationGestion(idDelegationGestion);
    this.affichage = 3;
    this.visibleAddForm = 0;
  }

  bienImmobilierChoisi(event: any) {
    this.bienImmobilierSelectionne = event.value;
  }

  gestionnaireChoisi(event: any) {
    this.gestionnaireSelectionne = event.value;
  }

  get gestionnaire(){
    return this.delegationGestionForm.get('gestionnaire');
  }

  get bienImmobilier(){
    return this.delegationGestionForm.get('bienImmobilier');
  }

  ajouterDelegationGestion(): void {

    this.delegationGestion.gestionnaire = this.gestionnaireSelectionne;
    this.delegationGestion.bienImmobilier = this.bienImmobilierSelectionne;
    console.log(this.delegationGestion)
    this.delegationGestionService.addDelegationGestion(this.delegationGestion).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.delegationGestions.push({
            id: response.id,
            gestionnaire: response.gestionnaire,
            bienImmobilier: response.bienImmobilier,
            dateDelegation: response.dateDelegation,
            statutDelegation: response.statutDelegation,
            creerLe: response.creerLe,
            creerPar: response.creerPar,
            modifierLe: response.modifierLe,
            modifierPar: response.modifierPar,
            statut: response.statut
          });
          this.voirListe();
          this.messageSuccess = "La délégation de la gestion de votre bien a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else {
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du gérant !"
          this.afficherFormulaireAjouter();
          this.delegationGestion.gestionnaire = response.gestionnaire;
          this.delegationGestion.bienImmobilier = response.bienImmobilier;
          this.messageService.add({ severity: 'error', summary: 'Erreur de modification', detail: this.messageErreur });
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409) {
        this.erreur = true;
        this.messageErreur = "Un gérant avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Ajout non réussi', detail: this.messageErreur });
      }
    })
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
          this.messageService.add({ severity: 'success', summary: 'Suppression de la délégation de gestion de bien confirmée', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Suppression de la délégation de gestion d\'un bien rejetée', detail: "Vous avez rejeté la suppression de la délégation de gestion de ce bien !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Suppression de la délégation de gestion d\'un bien annulée', detail: "Vous avez annulé la suppression de la délégation de gestion de ce bien !" });
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
        this.delegationGestionService.accepterDelegationGestion(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La délégation de la gestion de ce bien a été accepté avec succès !";
          this.messageService.add({ severity: 'success', summary: 'Acceptation de la délégation de gestion d\'un bien confirmée', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Acceptation de la délégation de gestion d\'un bien rejetée', detail: "Vous avez rejeté l'acceptation de la délégation de gestion de ce bien !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Acceptation de la délégation de gestion d\'un bien annulée', detail: "Vous avez annulé l'acceptation de la délégation de gestion de ce bien !" });
            break;
        }
      }
    });
  }

}
