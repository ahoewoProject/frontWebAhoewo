import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Notaire } from 'src/app/models/gestionDesComptes/Notaire';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { NotaireService } from 'src/app/services/gestionDesComptes/notaire.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-notaires',
  templateUrl: './notaires.component.html',
  styleUrls: ['./notaires.component.css']
})
export class NotairesComponent implements OnInit{

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  notaire = this.notaireService.notaire;
  notaires : Notaire[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  notaireForm: any;

  roleNotaire: Role = {
    id: 6,
    code: 'ROLE_NOTAIRE',
    libelle: 'Notaire',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(private notaireService: NotaireService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

  ngOnInit(): void {
    this.listeNotaires();
    this.initNotaireForm()
  }

  initNotaireForm(): void{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.notaireForm = new FormGroup({
      nom: new FormControl(this.notaire.nom, [Validators.required]),
      prenom: new FormControl(this.notaire.prenom, [Validators.required]),
      username: new FormControl(this.notaire.username, [Validators.required]),
      email: new FormControl(this.notaire.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl(this.notaire.motDePasse, [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      telephone: new FormControl(this.notaire.telephone, [Validators.required]),
    })
  }

  listeNotaires():void{
    this.notaireService.getAll().subscribe(
      (response) => {
        this.notaires = response;
      }
    );
  }

  // Récupération des notaires de la page courante
  get notairesParPage(): any[] {
    const startIndex = this.pageActuelle;
    const endIndex = startIndex + this.elementsParPage;
    return this.notaires.slice(startIndex, endIndex);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeNotaires()
  }

  voirListe(): void{
    this.listeNotaires();
    this.notaireForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.notaire = new Notaire();
  }

  detailNotaire(id: number): void {
    this.notaireService.findById(id).subscribe(
      (response) => {
        this.notaire = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailNotaire(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireModifier(id: number): void {
    this.detailNotaire(id);
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get nom(){
    return this.notaireForm.get('nom');
  }

  get prenom(){
    return this.notaireForm.get('prenom');
  }

  get username(){
    return this.notaireForm.get('username');
  }

  get email(){
    return this.notaireForm.get('email');
  }

  get motDePasse(){
    return this.notaireForm.get('motDePasse');
  }

  get telephone(){
    return this.notaireForm.get('telephone');
  }

  ajouterNotaire(): void {
    this.notaire.role = this.roleNotaire;

    this.notaireService.addNotaire(this.notaire).subscribe(
      (response) => {
        console.log(response);
        if(response.id > 0) {
          this.notaires.push({
            id: response.id,
            nom: response.nom,
            prenom: response.prenom,
            username: response.username,
            email: response.email,
            motDePasse: response.motDePasse,
            telephone: response.telephone,
            etatCompte: response.etatCompte,
            role: response.role,
            creerLe: response.creerLe,
            creerPar: response.creerPar,
            modifierLe: response.modifierLe,
            modifierPar: response.modifierPar,
            statut: response.statut,
            estCertifie: false,
            resetToken: ''
          });
          this.voirListe();
          this.messageSuccess = "Le notaire a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du notaire !"
          this.afficherFormulaireAjouter();
          this.notaire.nom = response.nom;
          this.notaire.prenom = response.prenom;
          this.notaire.username = response.username;
          this.notaire.email = response.email;
          this.notaire.telephone = response.telephone;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un notaire avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Ajout non réussi', detail: this.messageErreur });
      }
    })
  }

  deleteNotaire(id: number): void{
    this.notaireService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le notaire a été supprimé avec succès.";
        this.messageService.add({ severity: 'success', summary: 'Suppression réussie', detail: this.messageSuccess })
      }
    );
  }

  activerCompte(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({ severity: 'success', summary: 'Activation de compte confirmé', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Activation de compte rejetée', detail: "Vous avez rejeté l'activation de ce compte !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Activation de compte annulée', detail: "Vous avez annulé l'activation de ce compte !" });
            break;
        }
      }
    });
  }

  desactiverCompte(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Désactivaction de compte confirmé', detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Désactivation de compte rejetée', detail: 'Vous avez rejeté la désactivation de ce compte !' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Désactivation de compte annulée', detail: 'Vous avez annulé la désactivation de ce compte !' });
            break;
        }
      }
    });
  }
}
