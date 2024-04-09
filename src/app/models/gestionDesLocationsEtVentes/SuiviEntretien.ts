import { EntiteDeBase } from "../EntiteDeBase";
import { Contrat } from "./Contrat";
import { ContratLocation } from "./ContratLocation";

export class SuiviEntretien extends EntiteDeBase {

  id: number;
  codeSuiviEntretien!: string;
  libelle!: string;
  description!: string;
  contratLocation!: ContratLocation
  datePrevue!: Date;
  etatSuiviEntretien!: string;

  constructor() {
    super();
    this.id = 0;
  }
}
