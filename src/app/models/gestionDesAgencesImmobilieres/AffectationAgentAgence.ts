import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { AgentImmobilier } from './../gestionDesComptes/AgentImmobilier';
import { EntiteDeBase } from "../EntiteDeBase";

export class AffectationAgentAgence extends EntiteDeBase {

  id: number;
  agenceImmobiliere!: AgenceImmobiliere;
  agentImmobilier!: AgentImmobilier;
  dateAffectation!: Date;
  dateFin!: Date;
  actif!: boolean;

  constructor(){
    super();
    this.id = 0;
  }
}
