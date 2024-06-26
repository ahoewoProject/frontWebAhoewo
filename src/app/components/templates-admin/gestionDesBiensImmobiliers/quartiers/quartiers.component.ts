import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';

@Component({
  selector: 'app-quartiers',
  templateUrl: './quartiers.component.html',
  styleUrls: ['./quartiers.component.css']
})
export class QuartiersComponent implements OnInit, OnDestroy {

  recherche: string = '';
  villeSelectionnee!: Ville;
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  numeroDeLaPage!: number;
  elementsParPage!: number;

  quartier = this.quartierService.quartier;
  quartiers!: Page<Quartier>;
  villes: Ville[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private villeService: VilleService,
    private quartierService: QuartierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  quartierForm: any;

  ngOnInit(): void {
    this.loadStorage();
    this.listerVilles();
    this.listerQuartiers(this.numeroDeLaPage, this.elementsParPage);
    this.initQuartierForm();
  }

  initQuartierForm(): void {
    this.quartierForm = new FormGroup({
      libelle: new FormControl(this.quartier.libelle, [Validators.required]),
      ville: new FormControl('', [Validators.required])
    })
  }

  listerVilles(): void {
    this.villeService.getAll().subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  listerQuartiers(numeroDeLaPage: number, elementsParPage: number):void {
    this.quartierService.getQuartiersPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    console.log(this.numeroDeLaPage);
    localStorage.setItem('numeroDeLaPage', this.numeroDeLaPage.toString());
    localStorage.setItem('elementsParPage', this.elementsParPage.toString());

    this.listerQuartiers(this.numeroDeLaPage, this.elementsParPage);
  }

  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
  }

  voirListe(): void {
    this.loadStorage();
    this.listerQuartiers(this.numeroDeLaPage, this.elementsParPage);
    this.quartierForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  loadStorage(): void {
    const savedNumeroDeLaPage = localStorage.getItem('numeroDeLaPage');
    if (savedNumeroDeLaPage !== null) {
      this.numeroDeLaPage = parseInt(savedNumeroDeLaPage, 10);
    } else {
      this.numeroDeLaPage = 0;
    }

    const savedElementsParPage = localStorage.getItem('elementsParPage');
    if (savedElementsParPage !== null) {
      this.elementsParPage = parseInt(savedElementsParPage, 10);
    } else {
      this.elementsParPage = 5;
    }
  }

  annuler(): void {
    this.quartierForm.reset();
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
    this.villeSelectionnee = this.villes[0];
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.quartier = new Quartier();
  }

  detailQuartier(id: number): void {
    //console.log(id)
    this.quartierService.findById(id).subscribe(
      (response) => {
        this.quartier = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailQuartier(id);
    this.affichage = 0;
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get libelle() {
    return this.quartierForm.get('libelle');
  }

  get ville() {
    return this.quartierForm.get('ville');
  }

  ajouterQuartier(): void {
    this.quartier.ville = this.villeSelectionnee;
    this.quartierService.addQuartier(this.quartier).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le quartier a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de l'ajout du quartier !"
          this.afficherFormulaireAjouter();
          this.quartier.libelle = response.libelle;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      //console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Un quartier avec ce libelle existe déjà dans cette ville !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierQuartier(): void {
    this.quartier.ville = this.villeSelectionnee;
    this.quartierService.updateQuartier(this.quartier.id, this.quartier).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le quartier a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de la modification du quartier !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
          this.afficherFormulaireModifier(this.quartier.id);
        }
    },
    (error) =>{
      //console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Un quartier avec ce libelle existe déjà dans cette ville !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(this.quartier.id);
      }
    })
  }

  activerQuartier(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce quartier ?',
      header: "Activation d'un quartier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quartierService.activerQuartier(id).subscribe(
          (response) => {
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le quartier a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du quartier confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du quartier rejetée',
              detail: "Vous avez rejeté l'activation de ce quartier !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du quartier annulée',
              detail: "Vous avez annulé l'activation de ce quartier !"
            });
            break;
        }
      }
    });
  }

  desactiverQuartier(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce quartier ?',
      header: "Désactivaction d'un quartier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quartierService.desactiverQuartier(id).subscribe(
          (response) =>{
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le quartier a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation du quartier confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du quartier rejetée',
              detail: "Vous avez rejeté la désactivation du quartier !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du quartier annulée',
              detail: "Vous avez annulé la désactivation du quartier !"
            });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {

  }
}
