import { BienImmobilier } from "./BienImmobilier";

export class DelegationGestionRequest {

  id: number;
  matricule!: string;
  codeAgence!: string;
  bienImmobilier!: BienImmobilier;

  constructor(){
    this.id = 0;
  }
}
