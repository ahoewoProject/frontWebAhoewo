import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "../gestionDesComptes/Personne";
import { BienImmobilier } from "./BienImmobilier";

export class DelegationGestion extends EntiteDeBase {

  id: number;
  gestionnaire: Personne;
  agenceImmobiliere!: AgenceImmobiliere;
  bienImmobilier: BienImmobilier;
  dateDelegation!: Date;
  statutDelegation!: number;

  constructor() {
    super();
    this.id = 0;
    this.gestionnaire = new Personne();
    this.bienImmobilier = new BienImmobilier();
  }
}
