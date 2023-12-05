import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';

@Component({
  selector: 'app-quartiers',
  templateUrl: './quartiers.component.html',
  styleUrls: ['./quartiers.component.css']
})
export class QuartiersComponent implements OnInit {

  recherche: string = '';
  villeSelectionnee!: Ville;
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  pageActuelle = 0;
  elementsParPage = 5;

  quartier = this.quartierService.quartier;
  quartiers : Quartier[] = [];
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
    this.listerVilles();
    this.listerQuartiers();
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

  listerQuartiers():void {
    this.quartierService.getAll().subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  get quartiersParPage(): any[] {
    return this.quartiers.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listerQuartiers()
  }

  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
  }

  voirListe(): void {
    this.listerQuartiers();
    this.quartierForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.quartier = new Quartier();
  }

  detailQuartier(id: number): void {
    console.log(id)
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
      console.log(error)
      if (error.status === 409) {
        this.messageErreur = "Un quartier avec ce libelle existe déjà !";
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
      console.log(error)
      if (error.status === 409) {
        this.messageErreur = "Un quartier avec ce libelle existe déjà !";
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
        this.quartierService.activerQuartier(id).subscribe(response=>{
          console.log(response);
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
              summary: 'Activation ddu quartier rejetée',
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
        this.quartierService.desactiverQuartier(id).subscribe(response=>{
          console.log(response);
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
}
