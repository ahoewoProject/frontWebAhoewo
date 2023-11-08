import { EntiteDeBase } from "../EntiteDeBase";

export class TypeDeBien extends EntiteDeBase {

  id: number;
  designation: string;

  constructor(){
    super();
    this.id = 0;
    this.designation = '';
  }
}
