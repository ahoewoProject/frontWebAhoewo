import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "../gestionDesComptes/Personne";
import { ImagesBienImmobilier } from "./ImagesBienImmobilier";
import { Pays } from "./Pays";
import { Quartier } from "./Quartier";
import { Region } from "./Region";
import { TypeDeBien } from "./TypeDeBien";
import { Ville } from "./Ville";

export class BienImmobilier extends EntiteDeBase {

  id: number;
  codeBien: string;
  description!: Text;
  adresse: string;
  surface!: number;
  typeDeBien!: TypeDeBien;
  categorie!: string;
  quartier!: Quartier;
  personne!: Personne;
  agenceImmobiliere!: AgenceImmobiliere;
  statutBien: string;
  etatBien: boolean;
  estDelegue!: boolean;
  images!: ImagesBienImmobilier[];

  constructor() {
    super();
    this.id = 0;
    this.codeBien = '';
    this.adresse = '';
    this.statutBien = '';
    this.etatBien = true;
  }
}
