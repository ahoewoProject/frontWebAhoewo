import { Role } from "../gestionDesComptes/Role";


export class RegisterForm{

  id: number;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role: Role;

  constructor(){
    this.id = 0;
    this.nom = '';
    this.prenom = '';
    this.username = '';
    this.email = '';
    this.motDePasse = '';
    this.telephone = '';
    this.role = new Role();
  }
}
