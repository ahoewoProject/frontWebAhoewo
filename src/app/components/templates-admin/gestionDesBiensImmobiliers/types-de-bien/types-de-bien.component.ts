import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';

@Component({
  selector: 'app-types-de-bien',
  templateUrl: './types-de-bien.component.html',
  styleUrls: ['./types-de-bien.component.css']
})
export class TypesDeBienComponent implements OnInit {

  recherche: string = '';

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  numeroDeLaPage = 0;
  elementsParPage = 5;

  typeDeBien = this.typeDeBienService.typeDeBien;
  typesDeBien!: Page<TypeDeBien>;
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private typeDeBienService: TypeDeBienService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  typeDeBienForm: any;

  ngOnInit(): void {
    this.listeTypesDeBienPagines(0, 5);
    this.initTypeDeBienForm();
  }

  initTypeDeBienForm(): void {
    this.typeDeBienForm = new FormGroup({
      designation: new FormControl(this.typeDeBien.designation, [Validators.required]),
    })
  }

  listeTypesDeBienPagines(pageActuelle: number, elementsParPage: number):void {
    this.typeDeBienService.getTypesDeBienPagines(pageActuelle, elementsParPage).subscribe(
      (response) => {
        this.typesDeBien = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeTypesDeBienPagines(this.numeroDeLaPage, this.elementsParPage)
  }

  voirListe(): void {
    this.listeTypesDeBienPagines(this.numeroDeLaPage, this.elementsParPage);
    this.typeDeBienForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.typeDeBien = new TypeDeBien();
  }

  detailTypeDeBien(id: number): void {
    //console.log(id)
    this.typeDeBienService.findById(id).subscribe(
      (response) => {
        this.typeDeBien = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailTypeDeBien(id);
    this.affichage = 0;
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get designation() {
    return this.typeDeBienForm.get('designation');
  }

  ajouterTypeDeBien(): void {
    this.typeDeBienService.addTypeDeBien(this.typeDeBien).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le type de bien a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de l'ajout du type de bien !"
          this.afficherFormulaireAjouter();
          this.typeDeBien.designation = response.designation;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Un type de bien avec cette désignation existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }

  modifierTypeDeBien(): void {
    this.typeDeBienService.updateTypeDeBien(this.typeDeBien.id, this.typeDeBien).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le type de bien a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de la modification du type de bien !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
          this.afficherFormulaireModifier(this.typeDeBien.id);
        }
    },
    (error) =>{
      //console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Un type de bien avec cette désignation existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(this.typeDeBien.id);
      }
    })
  }

  activerTypeDeBien(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce type de bien ?',
      header: "Activation d'un type de bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeDeBienService.activerTypeDeBien(id).subscribe(response=>{
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le type de bien a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du type de bien confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du type de bien rejetée',
              detail: "Vous avez rejeté l'activation de ce type de bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du type de bien annulée',
              detail: "Vous avez annulé l'activation de ce type de bien !"
            });
            break;
        }
      }
    });
  }

  desactiverTypeDeBien(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce type de bien ?',
      header: "Désactivaction d'un type de bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeDeBienService.desactiverTypeDeBien(id).subscribe(response=>{
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le type de bien a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation du type de bien confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du type de bien rejetée',
              detail: "Vous avez rejeté la désactivation de ce type de bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du type de bien annulée',
              detail: "Vous avez annulé la désactivation de ce type de bien !"
            });
            break;
        }
      }
    });
  }

  supprimerTypeDeBien(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir supprimer ce type de bien ?',
      header: "Suppression d'un type de bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeDeBienService.deleteById(id).subscribe(
          (response) => {
            //console.log(response);
            this.voirListe();
            this.messageSuccess = "Le type de bien a été supprimé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Suppression du type de bien confirmée',
              detail: this.messageSuccess
            })
          },
          error => {
            if (error.status == 400) {
              this.messageErreur = "Impossible de supprimer ce type de bien car des biens immobiliers sont liés à ce dernier !"
              this.messageService.add({
                severity: 'warn',
                summary: 'Suppression impossible',
                detail: this.messageErreur
              })
            } else {
              this.messageErreur = "Une erreur s'est produite lors de la suppression de ce type de bien !"
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur lors de la suppression',
                detail: this.messageErreur
              })
            }
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Suppression du type de bien rejetée',
              detail: "Vous avez rejeté la suppression de ce type de bien !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Suppression du type de bien annulée',
              detail: "Vous avez annulé la suppression de ce type de bien !"
            });
            break;
        }
      }
    });
  }
}
