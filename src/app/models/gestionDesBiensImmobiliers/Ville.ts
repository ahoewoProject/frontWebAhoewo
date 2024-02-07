import { EntiteDeBase } from "../EntiteDeBase";
import { Region } from "./Region";

export class Ville extends EntiteDeBase {

  id: number;
  codeVille!: string;
  libelle: string;
  region!: Region;
  etat: Boolean;

  constructor() {
    super();
    this.id = 0;
    this.libelle = "";
    this.etat = true;
  }
}
