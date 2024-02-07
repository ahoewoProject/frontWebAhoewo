import { EntiteDeBase } from "../EntiteDeBase";
import { Pays } from "./Pays";

export class Region extends EntiteDeBase {

  id: number;
  codeRegion!: string;
  libelle: string;
  pays!: Pays
  etat: Boolean;

  constructor() {
    super();
    this.id = 0;
    this.libelle = "";
    this.etat = true;
  }
}
