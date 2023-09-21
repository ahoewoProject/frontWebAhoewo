import { EntiteDeBase } from "../EntiteDeBase";
import { Role } from "./Role";

export class Personne extends EntiteDeBase {

  id: number;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  motDePasse: string;
  telephone: string;
  etatCompte: boolean;
  estCertifie: boolean;
  resetToken!: string;
  role: Role;

  constructor() {
    super();
    this.id = 0;
    this.nom = '';
    this.prenom = '';
    this.username = '';
    this.email = '';
    this.motDePasse = '';
    this.telephone = '';
    this.etatCompte = true;
    this.estCertifie = false;
    this.role = new Role();
  }

}
