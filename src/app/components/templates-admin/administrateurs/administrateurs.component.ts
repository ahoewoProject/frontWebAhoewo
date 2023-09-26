import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Administrateur } from 'src/app/models/gestionDesComptes/Administrateur';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AdministrateurService } from 'src/app/services/gestionDesComptes/administrateur.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.css']
})
export class AdministrateursComponent implements OnInit {

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  erreur: boolean = false;
  admin = this.adminService.administrateur;
  administrateurs : Administrateur[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  adminForm: any;
  roleAdmin: Role = {
    id: 1,
    code: 'ROLE_ADMIN',
    libelle: 'Administrateur',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(private adminService: AdministrateurService,
    private personneService: PersonneService) { }

  ngOnInit(): void {
    this.listeAdmins();
    this.initAdminForm()
  }

  initAdminForm(): void{
    this.adminForm = new FormGroup({
      nom: new FormControl(this.admin.nom, [Validators.required]),
      prenom: new FormControl(this.admin.prenom, [Validators.required]),
      username: new FormControl(this.admin.username, [Validators.required]),
      email: new FormControl(this.admin.email, [Validators.required]),
      motDePasse: new FormControl(this.admin.motDePasse, [Validators.required]),
      telephone: new FormControl(this.admin.telephone, [Validators.required]),
    })
  }

  listeAdmins():void{
    this.adminService.getAll().subscribe(response=>{
      this.administrateurs = response;
    })
  }

  // Récupération des admins de la page courante
  get administrateursParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.administrateurs.slice(startIndex, endIndex);
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
    return Math.ceil(this.administrateurs.length / this.elementsParPage);
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
    this.listeAdmins();
    this.adminForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }


  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.admin = new Administrateur();
  }

  detailAdmin(id: number): void {
    console.log(id)
    this.adminService.findById(id).subscribe(response=>{
      this.admin = response;
      console.log(response);
    })
  }

  afficherPageDetail(id: number): void {
    this.detailAdmin(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireModifier(id: number): void {
    this.detailAdmin(id);
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get nom(){
    return this.adminForm.get('nom');
  }

  get prenom(){
    return this.adminForm.get('prenom');
  }

  get username(){
    return this.adminForm.get('username');
  }

  get email(){
    return this.adminForm.get('email');
  }

  get motDePasse(){
    return this.adminForm.get('motDePasse');
  }

  get telephone(){
    return this.adminForm.get('telephone');
  }

  ajouterAdmin(): void {
    console.log(this.admin)
    this.admin.role = this.roleAdmin;
    this.adminService.addAdministrateur(this.admin).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.administrateurs.push({
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
          this.messageSuccess = "L'administrateur a été ajouté avec succès.";
          setTimeout(() => {
            this.messageSuccess = null;
          }, 3000);
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout de l'administrateur !"
          this.afficherFormulaireAjouter();
          this.admin.nom = response.nom;
          this.admin.prenom = response.prenom;
          this.admin.username = response.username;
          this.admin.email = response.email;
          this.admin.telephone = response.telephone;
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
        this.messageErreur = "Un administrateur avec ce nom d'utilisateur existe déjà !";
        setTimeout(() => {
          this.erreur = false;
          this.messageErreur = '';
        }, 3000);
      }
    })
  }

  deleteAdmin(id: number): void{
    this.adminService.deleteById(id)
    .subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "L'administrateur a été supprimé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }

  activerCompte(id: number): void{
    this.personneService.activerCompte(id)
    .subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le compte a été activé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }

  desactiverCompte(id: number): void{
    this.personneService.desactiverCompte(id)
    .subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le compte a été désactivé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }
}
