import { EntiteDeBase } from "../EntiteDeBase";
import { Contrat } from "../gestionDesLocationsEtVentes/Contrat";

export class PlanificationPaiement extends EntiteDeBase {

  id: number;
  codePlanification!: string;
  typePlanification!: string;
  libelle!: string;
  montantDu!: number;
  montantPaye!: number;
  restePaye!: number;
  datePlanifiee!: Date;
  contrat!: Contrat;
  statutPlanification!: string;

  constructor() {
    super();
    this.id = 0;
  }
}
