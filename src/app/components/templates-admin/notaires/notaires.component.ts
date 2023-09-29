import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

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
    private personneService: PersonneService) { }

  ngOnInit(): void {
    this.listeNotaires();
    this.initNotaireForm()
  }

  initNotaireForm(): void{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.notaireForm = new FormGroup({
      nom: new FormControl(this.notaire.nom, [Validators.required]),
      prenom: new FormControl(this.notaire.prenom, [Validators.required]),
      username: new FormControl(this.notaire.username, [Validators.required]),
      email: new FormControl(this.notaire.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl(this.notaire.motDePasse, [Validators.required]),
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
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.notaires.slice(startIndex, endIndex);
  }

  // Fonction pour passer à la page précédente
  pagePrecedente() {
    if (this.pageActuelle > 1) {
      this.pageActuelle--;
    }
  }

  // Fonction pour passer à la page suivante
  pageSuivante() {
    if (this.pageActuelle < this.totalPages) {
      this.pageActuelle++;
    }
  }

  // Calcul du nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.notaires.length / this.elementsParPage);
  }

  // Génération du tableau des numéros de page
  get pages(): number[] {
    const totalPagesToShow = 3; // Nombre total de pages à afficher avant d'afficher "..." et la dernière page

    if (this.totalPages <= totalPagesToShow) {
      return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    // Affiche les 3 premières pages
    const firstPages = Array(totalPagesToShow).fill(0).map((x, i) => i + 1);

    // Affiche "..." et la dernière page
    const lastPage = this.totalPages;
    return [...firstPages, -1, lastPage];
  }

  // Fonction pour définir la page actuelle
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
    }
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
          setTimeout(() => {
            this.messageSuccess = null;
          }, 3000);
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
          setTimeout(() => {
            this.erreur = false;
            this.messageErreur = "";
          }, 3000);
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un notaire avec ce nom d'utilisateur existe déjà !";
        setTimeout(() => {
          this.erreur = false;
          this.messageErreur = "";
        }, 3000);
      }
    })
  }

  deleteNotaire(id: number): void{
    this.notaireService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le notaire a été supprimé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }

  activerCompte(id: number): void{
    this.personneService.activerCompte(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le compte a été activé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }

  desactiverCompte(id: number): void{
    this.personneService.desactiverCompte(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le compte a été désactivé avec succès.";
        setTimeout(() => {
          this.messageSuccess = null;
        }, 3000);
      }
    );
  }
}
