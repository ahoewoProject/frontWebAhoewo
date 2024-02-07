import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "./AgenceImmobiliere";
import { Services } from "./Services";

export class ServicesAgenceImmobiliere extends EntiteDeBase {

  id: number;
  services!: Services;
  agenceImmobiliere!: AgenceImmobiliere
  etat!: number;

  constructor(){
    super();
    this.id = 0;
  }
}
