import { EntiteDeBase } from "../EntiteDeBase";

export class Services extends EntiteDeBase {

  id: number;
  codeService!: string;
  nomService: string;
  description!: string;
  etat!: number;

  constructor(){
    super();
    this.id = 0;
    this.codeService = '';
    this.nomService = ''
  }
}
