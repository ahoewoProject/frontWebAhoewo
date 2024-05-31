import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "../gestionDesComptes/Personne";

export class ComptePaiement {

  id: number;
  codeComptePaiement!: string;
  type!: string;
  contact!: string;
  agenceImmobiliere!: AgenceImmobiliere;
  personne!: Personne;
  etatComptePaiement!: boolean;

  constructor() {
    this.id = 0;
  }
}
