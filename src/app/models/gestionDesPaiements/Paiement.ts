import { EntiteDeBase } from "../EntiteDeBase";
import { PlanificationPaiement } from "./PlanificationPaiement";

export class Paiement extends EntiteDeBase {

  id: number;
  codePaiement!: string;
  modePaiement!: string;
  planificationPaiement!: PlanificationPaiement;
  // numeroComptePaiement!: string;
  // referenceTransaction!: string;
  preuve!: string;
  montant!: number;
  datePaiement!: number;
  statutPaiement!: string;

  constructor() {
    super();
    this.id = 0;
  }
}
