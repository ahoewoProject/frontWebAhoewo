import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { AgentImmobilier } from '../gestionDesComptes/AgentImmobilier';

export class AffectationAgentAgenceRequest {

  id: number;
  matricule!: string;
  agenceImmobiliere!: AgenceImmobiliere;
  agentImmobilier!: AgentImmobilier;

  constructor(){
    this.id = 0;
  }
}
