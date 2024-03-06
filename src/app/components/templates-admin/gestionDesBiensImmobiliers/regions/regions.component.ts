import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  paysSelectionne!: Pays;

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  numeroDeLaPage = 0;
  elementsParPage = 5;

  region = this.regionService.region;
  regions!: Page<Region>;
  ListePays: Pays[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private regionService: RegionService,
    private paysService: PaysService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  regionForm: any;

  ngOnInit(): void {
    this.listerPays();
    this.listerRegions(this.numeroDeLaPage, this.elementsParPage);
    this.initRegionForm();
  }

  initRegionForm(): void {
    this.regionForm = new FormGroup({
      libelle: new FormControl(this.region.libelle, [Validators.required]),
      pays: new FormControl('', [Validators.required])
    })
  }

  listerRegions(numeroDeLaPage: number, elementsParPage: number):void {
    this.regionService.getRegionsPaginees(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.regions = response;
      }
    );
  }

  listerPays():void {
    this.paysService.getAll().subscribe(
      (response) => {
        this.ListePays = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listerRegions(this.numeroDeLaPage, this.elementsParPage);
  }

  paysChoisi(event: any) {
    this.paysSelectionne = event.value;
  }

  voirListe(): void {
    this.listerRegions(this.numeroDeLaPage, this.elementsParPage);
    this.regionForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  annuler(): void {
    this.regionForm.reset();
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
    this.paysSelectionne = this.ListePays[0];
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.region = new Region();
  }

  detailRegion(id: number): void {
    //console.log(id)
    this.regionService.findById(id).subscribe(
      (response) => {
        this.region = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailRegion(id);
    this.affichage = 0;
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get libelle() {
    return this.regionForm.get('libelle');
  }

  get pays() {
    return this.regionForm.get('pays');
  }

  ajouterRegion(): void {
    this.region.pays = this.paysSelectionne;
    this.regionService.addRegion(this.region).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La région a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de l'ajout de la région !"
          this.afficherFormulaireAjouter();
          this.region.libelle = response.libelle;
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
        this.messageErreur = "Une région avec ce libelle existe déjà dans ce pays !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierRegion(): void {
    this.region.pays = this.paysSelectionne;
    this.regionService.updateRegion(this.region.id, this.region).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La région a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de la modification de la région !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
          this.afficherFormulaireModifier(this.region.id);
        }
    },
    (error) =>{
      //console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Une région avec ce libelle existe déjà dans ce pays !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(this.region.id);
      }
    })
  }

  activerRegion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette région ?',
      header: "Activation d'une région",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.regionService.activerRegion(id).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "La région a été activé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Activation de la région confirmée',
              detail: this.messageSuccess
            })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de la région rejetée',
              detail: "Vous avez rejeté l'activation de cette région !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de région annulée',
              detail: "Vous avez annulé l'activation de cette région !"
            });
            break;
        }
      }
    });
  }

  desactiverRegion(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette région ?',
      header: "Désactivaction d'une région",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.regionService.desactiverRegion(id).subscribe(
          (response) => {
            this.voirListe();
            this.messageSuccess = "La région a été désactivé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Désactivation de la région confirmée',
              detail: this.messageSuccess
            })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de la région rejetée',
              detail: "Vous avez rejeté la désactivation de cette région !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de la région annulée',
              detail: "Vous avez annulé la désactivation de cette région !"
            });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {

  }
}
