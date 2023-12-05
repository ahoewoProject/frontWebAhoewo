import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements OnInit {

  recherche: string = '';

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  pageActuelle = 0;
  elementsParPage = 5;

  pays = this.paysService.pays;
  listePays : Pays[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private paysService: PaysService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  paysForm: any;

  ngOnInit(): void {
    this.listerPays();
    this.initPaysForm();
  }

  initPaysForm(): void {
    this.paysForm = new FormGroup({
      libelle: new FormControl(this.pays.libelle, [Validators.required]),
    })
  }

  listerPays():void {
    this.paysService.getAll().subscribe(
      (response) => {
        this.listePays = response;
      }
    );
  }

  get paysParPage(): any[] {
    return this.listePays.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listerPays()
  }

  voirListe(): void {
    this.listerPays();
    this.paysForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.pays = new Pays();
  }

  detailPays(id: number): void {
    console.log(id)
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
      console.log(error)
      if (error.status === 409) {
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
      console.log(error)
      if (error.status === 409) {
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
          console.log(response);
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
          console.log(response);
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
}
