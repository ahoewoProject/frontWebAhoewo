import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PaiementService } from 'src/app/services/gestionDesPaiements/paiement.service';
import { PlanificationPaiementService } from 'src/app/services/gestionDesPaiements/planification-paiement.service';

@Component({
  selector: 'app-effectuer-paiement',
  templateUrl: './effectuer-paiement.component.html',
  styleUrls: ['./effectuer-paiement.component.css']
})
export class EffectuerPaiementComponent implements OnInit, OnDestroy {

  modesPaiements: string[] = [];
  modePaiementSelectionne!: string;
  messageSuccess: string | null = null;
  messageErreur: string | null = null;
  paiementForm: any;
  planificationPaiement = this.planificationPaiementService.planificationPaiement;
  paiement = this.paiementService.paiement;
  user: any;
  preuve: any;
  preuveUrl: any;
  paiementData: FormData = new  FormData();

  constructor(
    private activatedRoute: ActivatedRoute, private planificationPaiementService: PlanificationPaiementService,
    private paiementService: PaiementService, private router: Router,
    private messageService: MessageService, private personneService: PersonneService
  ) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initPaiementForm();
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.afficherPagePaiement(parseInt(id))
      }
    });
  }

  afficherPagePaiement(id: number) {
    this.listeModesPaiements();
    this.planificationPaiementService.findById(id).subscribe(
      (data) => {
        this.planificationPaiement = data;
        this.paiement.montant = data.montantPaye;
      }
    )
  }

  initPaiementForm(): void {
    this.paiementForm = new FormGroup({
      modePaiement: new FormControl('', [Validators.required]),
      montant: new FormControl({value: '', disabled: true}, [Validators.required])
    })
  }

  get modePaiement() {
    return this.paiementForm.get('modePaiement')
  }

  get montant() {
    return this.paiementForm.get('montant')
  }

  telecharger(event: any) {
    const uploadedFile: File = event.files[0];
    this.preuve = uploadedFile;

    var reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = (_event)=>{
    this.preuveUrl = reader.result;
    }
    this.messageSuccess = "La preuve liée ce paiement a été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Téléchargement réussi !',
      detail: this.messageSuccess
    });
  }

  listeModesPaiements() {
    // if (!this.personneService.estClient(this.user.role.code)) {
    //   this.modesPaiements = ['Hors plateforme'];
    //   this.modePaiementSelectionne = this.modesPaiements[0];
    // } else {
    //   this.modesPaiements = ['Hors plateforme' , 'Mobile Money', 'Virement bancaire'];
    //   this.modePaiementSelectionne = this.modesPaiements[0];
    // }
    this.modesPaiements = ['Hors plateforme'];
    this.modePaiementSelectionne = this.modesPaiements[0];
  }

  modePaiementChoisi(event: any): void {
    this.modePaiementSelectionne = event.value
    if (this.planificationPaiement) {
      this.paiement.montant = this.planificationPaiement.montantPaye;
    }
  }

  resetPaiementForm() {
    this.preuve = '';
    this.preuveUrl = '';
    this.paiementForm.reset();
  }

  retourPageDetailPlanification(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/planification-paiement/' + id]);
  }

  ajouterPaiement(): void {
    if (this.modePaiementSelectionne == 'Hors plateforme') {
      this.paiementHorsSysteme();
    } else if (this.modePaiementSelectionne == 'Mobile Money') {
      this.paiementParMobileMoney();
    } else {
      this.paiementParVirementBancaire();
    }
  }

  paiementHorsSysteme(): void {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    this.paiementData.append('preuve', this.preuve);
    this.paiementData.append('paiementJson', JSON.stringify(this.paiement));

    this.paiementService.ajouterPaiement(this.paiementData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/paiements'], { queryParams: { paiementReussi: true } });
        }
      },
      (error) => {
        console.log(error)
        this.messageErreur = "Une erreur s'est produite lors de l'enregistrement !";
        this.messageService.add({
          severity: 'error',
          summary: 'Paiement échoué',
          detail: this.messageErreur
        })
      }
    )
  }

  paiementParMobileMoney() {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    this.paiementData.append('paiementJson', JSON.stringify(this.paiement));
    this.paiementService.initializePaymentByPaydunya(this.paiementData).subscribe(
      (redirectUrl) => {
        console.log(redirectUrl);
        window.open(redirectUrl, '_self');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  paiementParVirementBancaire() {
    this.paiement.modePaiement = this.modePaiementSelectionne;
    this.paiement.planificationPaiement = this.planificationPaiement;

    console.log(this.paiement)
    this.paiementService.initializePaymentByPayPal(this.paiement).subscribe(
      (redirectUrl) => {
        console.log(redirectUrl);
        window.open(redirectUrl, '_self');
      },
      (error) => {
        console.log(error);
      }
    );
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
