import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Gerant } from 'src/app/models/gestionDesComptes/Gerant';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { GerantService } from 'src/app/services/gestionDesComptes/gerant.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-gerants',
  templateUrl: './gerants.component.html',
  styleUrls: ['./gerants.component.css']
})
export class GerantsComponent implements OnInit{

  recherche: string = '';
  user: any;
  affichage = 1;
  visibleAddForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  gerant = this.gerantService.gerant;
  gerants!: Page<Gerant>;
  messageErreur: string = "";
  messageSuccess: string | null = null;

  gerantForm: any;
  roleGerant: Role = {
    id: 7,
    code: 'ROLE_GERANT',
    libelle: 'Gérant',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(private gerantService: GerantService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeGerants(this.numeroDeLaPage, this.elementsParPage);
    } else{
      this.listeGerantsParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    }
    this.initGerantForm()
  }

  initGerantForm(): void{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.gerantForm = new FormGroup({
      nom: new FormControl(this.gerant.nom, [Validators.required]),
      prenom: new FormControl(this.gerant.prenom, [Validators.required]),
      email: new FormControl(this.gerant.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl(this.gerant.telephone, [Validators.required]),
    })
  }

  listeGerants(numeroDeLaPage: number, elementsParPage: number): void {
    this.gerantService.getGerants(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.gerants = response;
      }
    );
  }

  listeGerantsParProprietaire(numeroDeLaPage: number, elementsParPage: number): void {
    this.gerantService.getGerantsParProprietaire(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.gerants = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeGerants(this.numeroDeLaPage, this.elementsParPage);
    } else{
      this.listeGerantsParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirListe(): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeGerants(this.numeroDeLaPage, this.elementsParPage);
    } else{
      this.listeGerantsParProprietaire(this.numeroDeLaPage, this.elementsParPage);
    }
    this.gerantForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.gerant = new Gerant();
  }

  detailGerant(id: number): void {
    //console.log(id)
    this.gerantService.findById(id).subscribe(
      (response) => {
        this.gerant = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailGerant(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
  }

  get nom() {
    return this.gerantForm.get('nom');
  }

  get prenom() {
    return this.gerantForm.get('prenom');
  }

  get email() {
    return this.gerantForm.get('email');
  }

  get telephone() {
    return this.gerantForm.get('telephone');
  }

  ajouterGerant(): void {
    this.gerant.role = this.roleGerant;

    this.gerantService.addGerant(this.gerant).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le gérant a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        }
        else {
          this.messageErreur = "Erreur lors de l'ajout du gérant !"
          this.afficherFormulaireAjouter();
          this.gerant.nom = response.nom;
          this.gerant.prenom = response.prenom;
          this.gerant.username = response.username;
          this.gerant.email = response.email;
          this.gerant.telephone = response.telephone;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'ajout',
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      //console.log(error)
      if(error.status === 409) {
        this.messageErreur = "Un gérant avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  supprimerGerant(id: number): void {
    this.gerantService.deleteById(id).subscribe(response=>{
      //(response);
      this.voirListe();
      this.messageSuccess = "Le gérant a été supprimé avec succès.";
      this.messageService.add({
        severity: 'success',
        summary: 'Suppression réussie',
        detail: this.messageSuccess
      });
    })
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          //(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de compte rejetée',
              detail: "Vous avez rejeté l'activation de ce compte !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de compte annulée',
              detail: "Vous avez annulé l'activation de ce compte !"
            });
            break;
        }
      }
    });
  }

  desactiverCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
          //console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de compte rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
            });
            break;
        }
      }
    });
  }

}
