import { Contrat } from "./Contrat";
import { DemandeLocation } from "./DemandeLocation";

export class ContratLocation extends Contrat {

  demandeLocation!: DemandeLocation;
  typeContrat!: string;
  debutPaiement!: number;
  jourSupplementPaiement: number;
  loyer!: number;
  avance!: number;
  caution!: number;
  dateDebut!: Date;
  dateFin!: Date;

  constructor() {
    super();
    this.jourSupplementPaiement =  1;
  }
}
