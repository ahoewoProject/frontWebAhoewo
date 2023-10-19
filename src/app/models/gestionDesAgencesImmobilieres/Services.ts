import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "./AgenceImmobiliere";

export class Services extends EntiteDeBase {

  id: number;
  nomService: string;
  description!: Text;
  agenceImmobiliere!: AgenceImmobiliere;

  constructor(){
    super();
    this.id = 0;
    this.nomService = ''
  }
}
