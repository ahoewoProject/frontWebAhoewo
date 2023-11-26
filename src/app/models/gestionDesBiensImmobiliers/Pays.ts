import { EntiteDeBase } from "../EntiteDeBase";

export class Pays extends EntiteDeBase {

  id: number;
  libelle: string;
  etat: Boolean;

  constructor() {
    super();
    this.id = 0;
    this.libelle = "";
    this.etat = true;
  }
}
