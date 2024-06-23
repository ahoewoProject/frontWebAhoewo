import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DelegationGestionForm1 } from 'src/app/models/gestionDesBiensImmobiliers/DelegationGestionForm1';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-deleguer-bien',
  templateUrl: './deleguer-bien.component.html',
  styleUrls: ['./deleguer-bien.component.css']
})
export class DeleguerBienComponent implements OnInit, OnDestroy {

  messageErreur: string | null = null;
  messageSuccess: string | null = null;

  listeDesChoix: any[] | undefined;
  listeDesCategories: string[] = [];
  checked: string | undefined;

  bienImmobilier: any;

  delegationGestionForm:  any;
  delegationGestionForm1 = new DelegationGestionForm1();

  user: any;

  constructor(private personneService: PersonneService, private messageService: MessageService,
    private agenceImmobiliereService: AgenceImmobiliereService, private bienImmobilierService: BienImmobilierService,
    private bienImmAssocieService: BienImmAssocieService, private confirmationService: ConfirmationService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private delegationGestionService: DelegationGestionService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initActivatedRoute();
    this.initDelegationGestionForm();
    this.afficherFormulaireDelegationGestionBien();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      const idBienAssocie = params.get('idBienAssocie');

      if (id && idBienAssocie) {
        this.detailBienAssocie(parseInt(idBienAssocie));
      } else if (id) {
        this.detailBienSupport(parseInt(id))
      } else {

      }
    });
  }

  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (data) => {
        this.bienImmobilier = data;
      }
    )
  }

  detailBienSupport(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
      }
    )
  }

  afficherFormulaireDelegationGestionBien(): void {
    this.listeDesChoix = [ 'Gérant', 'Démarcheur', 'Agence immobilière'];
    this.checked = this.listeDesChoix[0];
    const event = {value: this.checked};
    this.onChoixChange(event);
  }

  //Fonction pour initialiser le formulaire de délégation de gestion d'un bien
  initDelegationGestionForm(): void {
    this.delegationGestionForm = new FormGroup({
      matricule: new FormControl('', [Validators.required]),
      codeAgence: new FormControl('', [Validators.required])
    })
  }

  get matricule() {
    return this.delegationGestionForm.get('matricule')
  }

  get codeAgence() {
    return this.delegationGestionForm.get('codeAgence')
  }

  //Fonction pour changer l'entité à laquelle on délègue la gestion du bien
  onChoixChange(event: any): void {
    this.delegationGestionForm.reset();
    this.checked = event.value;
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.matricule.setValidators([Validators.required]);
      this.codeAgence.clearValidators();
    } else if (this.checked == 'Agence immobilière') {
      this.codeAgence.setValidators([Validators.required]);
      this.matricule.clearValidators();
    }
    this.matricule.updateValueAndValidity();
    this.codeAgence.updateValueAndValidity();
  }

  annulerDelegationGestion(): void {
    this.delegationGestionForm.reset;
  }

  //Fonction pour ajouter une délégation de gestion
  ajouterDelegationGestion(): void {
    if (this.checked == 'Gérant' ||  this.checked == 'Démarcheur') {
      this.delegationGestionToGerantOrDemarcheur();
    } else {
      this.delegationGestionToAgenceImmobiliere();
    }
  }

  delegationGestionToGerantOrDemarcheur(): void {
    this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
    this.delegationGestionService.addDelegationGestionMatricule(this.delegationGestionForm1).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
        } else {
          this.messageErreur = "Erreur lors de la délégation de gestion !"
          this.afficherFormulaireDelegationGestionBien();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      if (error.error == "Ce bien immobilier a été déjà délégué à ce gestionnaire !") {
        this.messageErreur = "Ce bien immobilier a été déjà délégué à ce gestionnaire !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail:  this.messageErreur
        });
      } else if (error.error == "Ce bien immobilier a été déjà délégué à un gestionnaire !") {
        this.messageErreur = "Ce bien immobilier a été déjà délégué à un gestionnaire !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail:  this.messageErreur
        });
      } else if (error.error == "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à un gestionnaire !" ) {
        this.messageErreur = "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à un gestionnaire !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail:  this.messageErreur
        });
      } else {
        this.messageErreur = "La matricule du gestionnaire est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail:  this.messageErreur
        });
      }
    })
  }

  delegationGestionToAgenceImmobiliere(): void {
    this.delegationGestionForm1.bienImmobilier = this.bienImmobilier;
    this.delegationGestionService.addDelegationGestionCodeAgence(this.delegationGestionForm1).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate(['/proprietaire/delegations-gestions'], { queryParams: { delegationReussie: true } })
        } else {
          this.messageErreur = "Erreur lors de la délégation de gestion !"
          this.afficherFormulaireDelegationGestionBien();
          this.messageService.add({
            severity: 'error',
            summary: "Erreur",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      if (error.error == "Ce bien immobilier a été déjà délégué à cette agence immobilière !") {
        this.messageErreur = "Ce bien immobilier a été déjà délégué à cette agence immobilière !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail: this.messageErreur
        });
      } else if (error.error == "Ce bien immobilier a été déjà délégué à une agence immobilière !") {
        this.messageErreur = "Ce bien immobilier a été déjà délégué à une agence immobilière !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail: this.messageErreur
        });
      } else if (error.error == "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à une agence immobilière !") {
        this.messageErreur = "Un bien immobilier se trouvant dans cette propriété a été déjà délégué à une agence immobilière !"
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail: this.messageErreur
        });
      } else if (error.status == 404 ) {
        this.messageErreur = "Le code de l'agence immobilière est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Délégation de gestion non réussi',
          detail:  this.messageErreur
        });
      }
    })
  }

  afficherListeBiens(bien: any): void {
    if (this.isBienSupport(bien.typeDeBien.designation)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/biens-supports']);
    } else {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/bien-support', bien.bienImmobilier.id, 'biens-associes']);
    }
  }

  private isBienSupport(designation: string): boolean {
    return designation == 'Terrain' ||
    designation == 'Villa' ||
    designation == 'Maison' ||
    designation == 'Immeuble';
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
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
