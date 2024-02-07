import { EntiteDeBase } from "../EntiteDeBase";
import { Ville } from "./Ville";

export class Quartier extends EntiteDeBase {

  id: number;
  codeQuartier!: string;
  libelle: string;
  ville!: Ville;
  etat: Boolean;

  constructor() {
    super();
    this.id = 0;
    this.libelle = "";
    this.etat = true;
  }
}
