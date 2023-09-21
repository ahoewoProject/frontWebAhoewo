import { EntiteDeBase } from "../EntiteDeBase";

export class Role extends EntiteDeBase {

  id: number;
  code: string;
  libelle: string;

  constructor(){
    super();
    this.id = 0;
    this.code = '';
    this.libelle = ''
  }
}
