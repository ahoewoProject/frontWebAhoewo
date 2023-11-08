import { EntiteDeBase } from "../EntiteDeBase";
import { Personne } from "../gestionDesComptes/Personne";
import { BienImmobilier } from "./BienImmobilier";

export class DelegationGestion extends EntiteDeBase {

  id: number;
  gestionnaire: Personne;
  bienImmobilier: BienImmobilier;
  dateDelegation!: Date;
  statutDelegation: boolean;

  constructor() {
    super();
    this.id = 0;
    this.gestionnaire = new Personne();
    this.bienImmobilier = new BienImmobilier();
    this.statutDelegation = false;
  }
}
