import { BienImmobilier } from "./BienImmobilier";

export class DelegationGestionForm1 {

  id: number;
  matricule!: string;
  codeAgence!: string;
  bienImmobilier!: BienImmobilier;

  constructor(){
    this.id = 0;
  }
}
