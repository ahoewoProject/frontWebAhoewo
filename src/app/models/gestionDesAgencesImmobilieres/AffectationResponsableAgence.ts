import { EntiteDeBase } from "../EntiteDeBase";
import { ResponsableAgenceImmobiliere } from "../gestionDesComptes/ResponsableAgenceImmobiliere";
import { AgenceImmobiliere } from "./AgenceImmobiliere";

export class AffectationResponsableAgence extends EntiteDeBase {

  id: number;
  responsableAgenceImmobiliere!: ResponsableAgenceImmobiliere;
  agenceImmobiliere!: AgenceImmobiliere;
  dateDebut!: Date;
  dateFin!: Date;
  actif!: boolean;

  constructor(){
    super();
    this.id = 0;
  }
}
