import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
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
  visibleUpdateForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  gerant = this.gerantService.gerant;
  gerants : Gerant[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  gerantForm: any;
  roleGerant: Role = {
    id: 7,
    code: 'ROLE_GERANT',
    libelle: 'Gerant',
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
    if(this.user.role.code == 'ROLE_ADMINISTRATEUR'){
      this.listeGerants();
    }else{
      this.listeGerantsParProprietaire();
    }
    this.initGerantForm()
  }

  initGerantForm(): void{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.gerantForm = new FormGroup({
      nom: new FormControl(this.gerant.nom, [Validators.required]),
      prenom: new FormControl(this.gerant.prenom, [Validators.required]),
      username: new FormControl(this.gerant.username, [Validators.required]),
      email: new FormControl(this.gerant.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl(this.gerant.motDePasse, [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      telephone: new FormControl(this.gerant.telephone, [Validators.required]),
    })
  }

  listeGerants(): void{
    this.gerantService.getAll().subscribe(
      (response) => {
        this.gerants = response;
      }
    );
  }

  listeGerantsParProprietaire(): void{
    this.gerantService.findGerantsByProprietaire().subscribe(
      (response) => {
        this.gerants = response;
      }
    );
  }

  // Récupération des gérants de la page courante
  get gerantsParPage(): any[] {
    const startIndex = this.pageActuelle;
    const endIndex = startIndex + this.elementsParPage;
    return this.gerants.slice(startIndex, endIndex);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeGerants()
  }

  voirListe(): void{
    if(this.user.role.code == 'ROLE_ADMINISTRATEUR'){
      this.listeGerants();
    }else{
      this.listeGerantsParProprietaire();
    }
    this.gerantForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.gerant = new Gerant();
  }

  detailGerant(id: number): void {
    console.log(id)
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
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireModifier(id: number): void {
    this.detailGerant(id);
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get nom(){
    return this.gerantForm.get('nom');
  }

  get prenom(){
    return this.gerantForm.get('prenom');
  }

  get username(){
    return this.gerantForm.get('username');
  }

  get email(){
    return this.gerantForm.get('email');
  }

  get motDePasse(){
    return this.gerantForm.get('motDePasse');
  }

  get telephone(){
    return this.gerantForm.get('telephone');
  }

  ajouterGerant(): void {
    this.gerant.role = this.roleGerant;

    this.gerantService.addGerant(this.gerant).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.gerants.push({
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
          this.messageSuccess = "Le gérant a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du gérant !"
          this.afficherFormulaireAjouter();
          this.gerant.nom = response.nom;
          this.gerant.prenom = response.prenom;
          this.gerant.username = response.username;
          this.gerant.email = response.email;
          this.gerant.telephone = response.telephone;
          this.messageService.add({ severity: 'error', summary: 'Erreur de modification', detail: this.messageErreur });
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un gérant avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Ajout non réussi', detail: this.messageErreur });
      }
    })
  }

  deleteGerant(id: number): void{
    this.gerantService.deleteById(id).subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le gérant a été supprimé avec succès.";
      this.messageService.add({ severity: 'success', summary: 'Suppression réussie', detail: this.messageSuccess })
    })
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
