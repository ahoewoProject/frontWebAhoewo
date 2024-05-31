import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { ContratLocation } from 'src/app/models/gestionDesLocationsEtVentes/ContratLocation';
import { SuiviEntretien } from 'src/app/models/gestionDesLocationsEtVentes/SuiviEntretien';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ContratLocationService } from 'src/app/services/gestionDesLocationsEtVentes/contrat-location.service';
import { SuiviEntretienService } from 'src/app/services/gestionDesLocationsEtVentes/suivi-entretien.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-suivis-entretiens',
  templateUrl: './suivis-entretiens.component.html',
  styleUrls: ['./suivis-entretiens.component.css']
})
export class SuivisEntretiensComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  elementsParPage = 5;
  numeroDeLaPage = 0;
  contratLocationSelectionne!: ContratLocation;
  datePrevueSelectionnee!: Date;

  user: any;
  APIEndpoint: string;
  suivisEntretiens!: Page<SuiviEntretien>;
  suiviEntretien = this.suiviEntretienService.suiviEntretien;
  suiviEntretienForm: any;
  contratsLocations: ContratLocation[] = [];
  messageSuccess: string | null = null;
  messageErreur: string = "";
  suiviEntretienReussi: any;

  constructor(private suiviEntretienService: SuiviEntretienService, private contratLocationService: ContratLocationService,
    private personneService: PersonneService, private activatedRoute: ActivatedRoute,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.suiviEntretienReussi = this.activatedRoute.snapshot.queryParams['suiviEntretienReussi'];
    this.listeContratsLocations();
    this.initSuiviEntretienForm();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.affichage = 2;
        this.detailSuiviEntretien(parseInt(id));
      } else {
        this.listeSuivisEntretiens(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  listeSuivisEntretiens(numeroDeLaPage: number, elementsParPage: number): void {
    this.suiviEntretienService.getSuiviEntretiens(numeroDeLaPage, elementsParPage).subscribe(
      (data) => {
        this.suivisEntretiens = data;
        if (this.suiviEntretienReussi) {
          this.messageService.add({ severity: 'success', summary: 'Signalement réussi', detail: 'Le souci d\'entretien a été signalé avec succès.' });
        }
      }
    )
  }

  listeContratsLocations(): void {
    this.contratLocationService.listContratsLocations().subscribe(
      (response) => {
        this.contratsLocations = response;
        this.contratLocationSelectionne = this.contratsLocations[0];
      }
    )
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeSuivisEntretiens(this.numeroDeLaPage, this.elementsParPage);
  }

  detailSuiviEntretien(id: number): void {
    this.suiviEntretienService.findById(id).subscribe(
      (data) => {
        this.suiviEntretien = data;
      }
    )
  }

  contratLocationChoisie(event: any) {
    this.contratLocationSelectionne = event.value;
  }

  initSuiviEntretienForm(): void {
    this.suiviEntretienForm = new FormGroup({
      contratLocation: new FormControl(''),
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      datePrevue: new FormControl('', [Validators.required]),
    })
  }

  get contratLocation() {
    return this.suiviEntretienForm.get('contratLocation')
  }

  get libelle() {
    return this.suiviEntretienForm.get('libelle')
  }

  get description() {
    return this.suiviEntretienForm.get('description')
  }

  get datePrevue() {
    return this.suiviEntretienForm.get('datePrevue')
  }

  voirListe(): void {
    this.affichage = 1;
    this.suiviEntretienForm.reset();
    this.listeSuivisEntretiens(this.numeroDeLaPage, this.elementsParPage);
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/suivis-entretiens']);
  }

  afficherPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/suivis-entretiens/' + id]);
  }

  afficherPageAjouter(): void {
    this.listeContratsLocations();
    this.affichage = 3;
  }

  datePrevueChoisie(event: any): void {
    this.datePrevueSelectionnee = event;
  }

  ajouterSuiviEntretien(): void {
    this.suiviEntretien.contratLocation = this.contratLocationSelectionne;
    this.suiviEntretienService.ajouterSuiviEntretien(this.suiviEntretien).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "L'entretien a été ajouté avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.messageService.add({
            severity: 'error',
            summary: 'Ajout échoué',
            detail: this.messageErreur
          })
        }
      }
    )
  }

  afficherPageModifier(id: number): void {
    this.listeContratsLocations();
    this.suiviEntretienService.findById(id).subscribe(
      (data) => {
        this.suiviEntretien = data;
        this.datePrevueSelectionnee = new Date(this.suiviEntretien.datePrevue)
      }
    )
    this.affichage = 4;
  }

  modifierSuiviEntretien(): void{
    this.suiviEntretien.datePrevue =  this.datePrevueSelectionnee;
    this.suiviEntretienService.modifierSuiviEntretien(this.suiviEntretien.id, this.suiviEntretien).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "L'entretien a été modifié avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la modification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Modification échouée',
            detail: this.messageErreur
          })
        }
      }
    )
  }

  annuler(): void {
    this.suiviEntretienForm.reset();
  }

  //Debuter entretien
  debuterEntretien(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir débuter cet entretien ?',
      header: "Débuter un entretien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.suiviEntretienService.debuterEntretien(id).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "L'entretien a débuté avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Début d\'un entretien confirmé',
              detail: this.messageSuccess
            })
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Début d\'un entretien rejeté',
              detail: "Vous avez rejeté le début de cet entretien!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Début d\'un entretien annulé',
              detail: "Vous avez annulé le début de cet entretien !"
            });
            break;
        }
      }
    });
  }

  //Terminer Entretien
  terminerEntretien(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir terminer cet entretien ?',
      header: "Terminer un entretien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.suiviEntretienService.terminerEntretien(id).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "L'entretien est terminé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Terminaison d\'un entretien confirmé',
              detail: this.messageSuccess
            })
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Terminaison d\'un entretien rejetée',
              detail: "Vous avez rejeté la terminaison de cet entretien!"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Terminaison d\'un entretien annulé',
              detail: "Vous avez annulé la terminaison de cet entretien!"
            });
            break;
        }
      }
    });
  }

  afficherCategorie(): boolean {
    return this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Maison' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Villa' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Immeuble' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Appartement' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Chambre salon' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Chambre' ||
    this.suiviEntretien.contratLocation.bienImmobilier.typeDeBien.designation == 'Bureau';
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
