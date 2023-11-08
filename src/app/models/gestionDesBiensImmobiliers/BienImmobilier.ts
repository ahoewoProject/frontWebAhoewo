import { EntiteDeBase } from "../EntiteDeBase";
import { Personne } from "../gestionDesComptes/Personne";
import { TypeDeBien } from "./TypeDeBien";

export class BienImmobilier extends EntiteDeBase {

  id: number;
  numeroIdentifiant: string;
  description!: Text;
  adresse: string;
  ville: string;
  surface: number;
  typeDeBien: TypeDeBien;
  personne: Personne;
  imagePrincipale: string;
  statutBien: string;
  etatBien: boolean;

  constructor() {
    super();
    this.id = 0;
    this.numeroIdentifiant = '';
    this.adresse = '';
    this.ville = '';
    this.surface = 0;
    this.typeDeBien = new TypeDeBien();
    this.personne = new Personne();
    this.imagePrincipale = '';
    this.statutBien = '';
    this.etatBien = true;
  }
}
