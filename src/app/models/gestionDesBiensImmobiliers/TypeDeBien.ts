import { EntiteDeBase } from "../EntiteDeBase";

export class TypeDeBien extends EntiteDeBase {

  id: number;
  designation: string;
  etat: boolean;

  constructor(){
    super();
    this.id = 0;
    this.designation = '';
    this.etat = true;
  }
}
