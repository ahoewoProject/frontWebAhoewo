import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements OnInit, OnDestroy {

  recherche: string = '';

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  numeroDeLaPage = 0;
  elementsParPage = 5;

  pays = this.paysService.pays;
  listePays!: Page<Pays>;
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private paysService: PaysService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  paysForm: any;

  ngOnInit(): void {
    this.listerPaysPagines(this.numeroDeLaPage, this.elementsParPage);
    this.initPaysForm();
  }

  initPaysForm(): void {
    this.paysForm = new FormGroup({
      libelle: new FormControl(this.pays.libelle, [Validators.required]),
    })
  }

  listerPaysPagines(numeroDeLaPage: number, elementsParPage: number):void {
    this.paysService.getPaysPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.listePays = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listerPaysPagines(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listerPaysPagines(this.numeroDeLaPage, this.elementsParPage);
    this.paysForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  annuler(): void {
    this.paysForm.reset();
    if (this.visibleAddForm == 1) {
      this.affichage = 0;
      this.visibleAddForm = 1;
      this.visibleUpdateForm = 0;
    } else {
      this.affichage = 0;
      this.visibleUpdateForm = 1;
      this.visibleAddForm = 0;
    }
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.pays = new Pays();
  }

  detailPays(id: number): void {
    //console.log(error)(id)
    this.paysService.findById(id).subscribe(
      (response) => {
        this.pays = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailPays(id);
    this.affichage = 0;
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get libelle() {
    return this.paysForm.get('libelle');
  }

  ajouterPays(): void {
    this.paysService.addPays(this.pays).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le pays a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de l'ajout du pays !"
          this.afficherFormulaireAjouter();
          this.pays.libelle = response.libelle;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      //console.log(error)(error)
      if (error.status == 409) {
        this.messageErreur = "Un pays avec ce libelle existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierPays(): void {
    this.paysService.updatePays(this.pays.id, this.pays).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le pays a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de la modification du pays !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
          this.afficherFormulaireModifier(this.pays.id);
        }
    },
    (error) =>{
      //console.log(error)(error)
      if (error.status == 409) {
        this.messageErreur = "Un pays avec ce libelle existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(this.pays.id);
      }
    })
  }

  activerPays(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce pays ?',
      header: "Activation d'un pays",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.paysService.activerPays(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le pays a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du pays confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du pays rejetée',
              detail: "Vous avez rejeté l'activation de ce pays !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du pays annulée',
              detail: "Vous avez annulé l'activation de ce pays !"
            });
            break;
        }
      }
    });
  }

  desactiverPays(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce pays ?',
      header: "Désactivaction d'un pays",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.paysService.desactiverPays(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le pays a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation du pays confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du pays rejetée',
              detail: "Vous avez rejeté la désactivation de ce pays !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du pays annulée',
              detail: "Vous avez annulé la désactivation de ce pays !"
            });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {

  }
}
