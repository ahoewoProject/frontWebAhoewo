import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { RoleService } from 'src/app/services/gestionDesComptes/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{

  recherche: string = '';

  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;

  pageActuelle = 0;
  elementsParPage = 5;

  role = this.roleService.role;
  roles : Role[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  constructor(
    private roleService: RoleService,
    private messageService: MessageService
  ) {}

  roleForm: any;

  ngOnInit(): void {
    this.listeRoles();
    this.initRoleForm();
  }

  initRoleForm(): void{
    this.roleForm = new FormGroup({
      code: new FormControl(this.role.code, [Validators.required]),
      libelle: new FormControl(this.role.libelle, [Validators.required]),
    })
  }

  listeRoles():void{
    this.roleService.getAll().subscribe(
      (response) => {
        this.roles = response;
      }
    );
  }

  get rolesParPage(): any[]{
    return this.roles.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeRoles()
  }

  voirListe(): void{
    this.listeRoles();
    this.roleForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.role = new Role();
  }

  detailRole(id: number): void {
    console.log(id)
    this.roleService.findById(id).subscribe(
      (response) => {
        this.role = response;
      }
    );
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
    this.roleService.addRole(this.role).subscribe(
      (response) =>{
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
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else{
          this.messageErreur = "Erreur lors de l'ajout du rôle !"
          this.afficherFormulaireAjouter();
          this.role.code = response.code;
          this.role.libelle = response.libelle;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.messageErreur = "Un rôle avec ce code existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }

  modifierRole(): void {
    this.roleService.updateRole(this.role.id, this.role).subscribe(
      (response) =>{
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le rôle a été modifié avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Modification réussie', detail: this.messageSuccess })
        }
        else{
          this.messageErreur = "Erreur lors de la modification du rôle !";
          this.messageService.add({ severity: 'error', summary: 'Erreur modification', detail: this.messageErreur });
          this.afficherFormulaireModifier(this.role.id);
        }
    },
    (error) =>{
      console.log(error)
      if(error.status === 409){
        this.messageErreur = "Un rôle avec ce code existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Modification non réussie', detail: this.messageErreur });
        this.afficherFormulaireModifier(this.role.id);
      }
    })
  }

  deleteRole(id: number): void{
    this.roleService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "Le rôle a été supprimé avec succès.";
        this.messageService.add({ severity: 'success', summary: 'Ahoewo', detail: this.messageSuccess })
      }
    );
  }
}
