import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';

@Component({
  selector: 'app-villes',
  templateUrl: './villes.component.html',
  styleUrls: ['./villes.component.css']
})
export class VillesComponent implements OnInit {

  recherche: string = '';
  regionSelectionnee!: Region;
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  pageActuelle = 0;
  elementsParPage = 5;

  ville = this.villeService.ville;
  villes: Ville[] = [];
  regions: Region[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private villeService: VilleService,
    private regionService: RegionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  villeForm: any;

  ngOnInit(): void {
    this.listerRegions();
    this.listerVilles();
    this.initVilleForm();
  }

  initVilleForm(): void {
    this.villeForm = new FormGroup({
      libelle: new FormControl(this.ville.libelle, [Validators.required]),
      region: new FormControl('', [Validators.required])
    })
  }

  listerRegions(): void {
    this.regionService.getAll().subscribe(
      (response) => {
        this.regions = response;
      }
    );
  }

  listerVilles():void {
    this.villeService.getAll().subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
  }

  get villesParPage(): any[] {
    return this.villes.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listerVilles()
  }

  voirListe(): void {
    this.listerVilles();
    this.villeForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.ville = new Ville();
  }

  detailVille(id: number): void {
    console.log(id)
    this.villeService.findById(id).subscribe(
      (response) => {
        this.ville = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailVille(id);
    this.affichage = 0;
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get libelle() {
    return this.villeForm.get('libelle');
  }

  get region() {
    return this.villeForm.get('region');
  }

  ajouterVille(): void {
    this.ville.region = this.regionSelectionnee;
    this.villeService.addVille(this.ville).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La ville a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de l'ajout de la ville !"
          this.afficherFormulaireAjouter();
          this.ville.libelle = response.libelle;
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
        this.messageErreur = "Une ville avec ce libelle existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierVille(): void {
    this.ville.region = this.regionSelectionnee;
    this.villeService.updateVille(this.ville.id, this.ville).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La ville a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Erreur lors de la modification de la ville !";
          this.messageService.add({
            severity: 'error', summary: 'Erreur modification',
            detail: this.messageErreur
            });
          this.afficherFormulaireModifier(this.ville.id);
        }
    },
    (error) =>{
      console.log(error)
      if (error.status == 409) {
        this.messageErreur = "Une ville avec ce libelle existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
        this.afficherFormulaireModifier(this.ville.id);
      }
    })
  }

  activerVille(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette ville ?',
      header: "Activation d'une ville",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.villeService.activerVille(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La ville a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de la ville confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de la ville rejetée',
              detail: "Vous avez rejeté l'activation de cette ville !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de la ville annulée',
              detail: "Vous avez annulé l'activation de cette ville !"
            });
            break;
        }
      }
    });
  }

  desactiverVille(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette ville ?',
      header: "Désactivaction d'une ville",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.villeService.desactiverVille(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "La ville a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation de la ville confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de la ville rejetée',
              detail: "Vous avez rejeté la désactivation de cette ville !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de la ville annulée',
              detail: "Vous avez annulé la désactivation de cette ville !"
            });
            break;
        }
      }
    });
  }
}
