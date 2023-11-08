import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
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

  pageActuelle = 0;
  elementsParPage = 5;

  erreur: boolean = false;
  typeDeBien = this.typeDeBienService.typeDeBien;
  typesDeBien : TypeDeBien[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private typeDeBienService: TypeDeBienService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  typeDeBienForm: any;

  ngOnInit(): void {
    this.listeTypesDeBien();
    this.initTypeDeBienForm();
  }

  initTypeDeBienForm(): void{
    this.typeDeBienForm = new FormGroup({
      designation: new FormControl(this.typeDeBien.designation, [Validators.required]),
    })
  }

  listeTypesDeBien():void{
    this.typeDeBienService.getAll().subscribe(
      (response) => {
        this.typesDeBien = response;
      }
    );
  }

  get typesDeBienParPage(): any[]{
    return this.typesDeBien.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeTypesDeBien()
  }

  voirListe(): void{
    this.listeTypesDeBien();
    this.typeDeBienForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.typeDeBien = new TypeDeBien();
  }

  detailTypeDeBien(id: number): void {
    console.log(id)
    this.typeDeBienService.findById(id).subscribe(
      (response) => {
        this.typeDeBien = response;
      }
    );
  }

  afficherFormulaireModifier(id: number): void {
    this.detailTypeDeBien(id);
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get designation(){
    return this.typeDeBienForm.get('designation');
  }

  ajouterTypeDeBien(): void {
    this.typeDeBienService.addTypeDeBien(this.typeDeBien).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.typesDeBien.push({
            id: response.id,
            designation: response.designation,
            creerPar: 0,
            creerLe: new Date(),
            modifierPar: 0,
            modifierLe: new Date(),
            statut: false
          });
          this.voirListe();
          this.messageSuccess = "Le type de bien a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du type de bien !"
          this.afficherFormulaireAjouter();
          this.typeDeBien.designation = response.designation;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un type de bien avec cette désignation existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }

  modifierTypeDeBien(): void {
    this.typeDeBienService.updateTypeDeBien(this.typeDeBien.id, this.typeDeBien).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le type de bien a été modifié avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Modification réussie', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de la modification du type de bien !";
          this.messageService.add({ severity: 'error', summary: 'Erreur modification', detail: this.messageErreur });
          this.afficherFormulaireModifier(this.typeDeBien.id);
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un type de bien avec cette désignation existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Modification non réussie', detail: this.messageErreur });
        this.afficherFormulaireModifier(this.typeDeBien.id);
      }
    })
  }

  supprimerTypeDeBien(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir supprimer ce type de bien ?',
      header: "Suppression d'un type de bien",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeDeBienService.deleteById(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le type de bien a été supprimé avec succès !";
          this.messageService.add({ severity: 'success', summary: 'Suppression du type de bien confirmée', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Suppression du type de bien rejetée', detail: "Vous avez rejeté la suppression de ce type de bien !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Suppression du type de bien annulée', detail: "Vous avez annulé la suppression de ce type de bien !" });
            break;
        }
      }
    });
  }
}
