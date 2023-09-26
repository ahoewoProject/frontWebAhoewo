import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { RoleService } from 'src/app/services/gestionDesComptes/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  erreur: boolean = false;
  role = this.roleService.role;
  roles : Role[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(private roleService: RoleService) { }

  roleForm: any;

  ngOnInit(): void {
    this.listeRoles();
    this.initRoleForm()
  }

  initRoleForm(): void{
    this.roleForm = new FormGroup({
      code: new FormControl(this.role.code, [Validators.required]),
      libelle: new FormControl(this.role.libelle, [Validators.required]),
    })
  }

  listeRoles():void{
    this.roleService.getAll().subscribe(response=>{
      this.roles = response;
    })
  }

  // Récupération des rôles de la page courante
  get rolesParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.roles.slice(startIndex, endIndex);
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
    return Math.ceil(this.roles.length / this.elementsParPage);
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
    this.listeRoles();
    this.roleForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.role = new Role();
  }

  detailRole(id: number): void {
    console.log(id)
    this.roleService.findById(id).subscribe(response=>{
      this.role = response;
      console.log(response);
    })
  }

  afficherPageDetail(id: number): void {
    this.detailRole(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireModifier(id: number): void {
    this.detailRole(id);
    this.visibleUpdateForm = 1;
    this.visibleAddForm = 0;
  }

  get code(){
    return this.roleForm.get('code');
  }

  get libelle(){
    return this.roleForm.get('libelle');
  }

  ajouterRole(): void {
    console.log(this.role)
    this.roleService.addRole(this.role).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.roles.push({
            id: response.id,
            code: response.code,
            libelle: response.libelle,
            creerPar: 0,
            creerLe: new Date(),
            modifierPar: 0,
            modifierLe: new Date(),
            statut: false
          });
          this.voirListe();
          this.messageSuccess = "Le rôle a été ajouté avec succès.";
          setTimeout(() => {
            this.messageSuccess = null;
          }, 3000);
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du rôle !"
          this.afficherFormulaireAjouter();
          this.role.code = response.code;
          this.role.libelle = response.libelle;
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
        this.messageErreur = "Un rôle avec ce code existe déjà !";
        setTimeout(() => {
          this.erreur = false;
          this.messageErreur = "";
        }, 3000);
      }
    })
  }

  modifierRole(): void {
    console.log(this.role.id)
    this.roleService.updateRole(this.role.id, this.role).subscribe(
      (response) =>{
        console.log(response);
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le rôle a été modifié avec succès.";
          setTimeout(() => {
            this.messageSuccess = null;
          }, 3000);
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de la modification du rôle !";
          setTimeout(() => {
            this.erreur = false;
            this.messageErreur = "";
          }, 3000);
          this.afficherFormulaireModifier(this.role.id);
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Un rôle avec ce code existe déjà !";
        setTimeout(() => {
          this.erreur = false;
          this.messageErreur = "";
        }, 3000);
        this.afficherFormulaireModifier(this.role.id);
      }
    })
  }

  deleteRole(id: number): void{
    this.roleService.deleteById(id).subscribe(response=>{
      console.log(response);
      this.voirListe();
      this.messageSuccess = "Le rôle a été supprimé avec succès.";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    })
  }
}
