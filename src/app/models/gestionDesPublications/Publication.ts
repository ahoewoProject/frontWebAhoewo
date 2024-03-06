import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { BienImmobilier } from "../gestionDesBiensImmobiliers/BienImmobilier";
import { Personne } from "../gestionDesComptes/Personne";

export class Publication extends EntiteDeBase {

  id: number;
  codePublication!: string;
  typeDeTransaction!: string;
  libelle!: string;
  datePublication!: Date;
  bienImmobilier!: BienImmobilier;
  prixDuBien!: number;
  fraisDeVisite!: number;
  avance!: number;
  caution!: number;
  commission!: number;
  personne!: Personne;
  agenceImmobiliere!: AgenceImmobiliere

  constructor() {
    super();
    this.id = 0;
  }
}
