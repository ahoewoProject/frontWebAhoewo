import { EntiteDeBase } from "../EntiteDeBase";
import { Personne } from "../gestionDesComptes/Personne";
import { ImagesBienImmobilier } from "./ImagesBienImmobilier";
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
  statutBien: string;
  etatBien: boolean;
  images!: ImagesBienImmobilier[];

  constructor() {
    super();
    this.id = 0;
    this.numeroIdentifiant = '';
    this.adresse = '';
    this.ville = '';
    this.surface = 0;
    this.typeDeBien = new TypeDeBien();
    this.personne = new Personne();
    this.statutBien = '';
    this.etatBien = true;
  }
}
