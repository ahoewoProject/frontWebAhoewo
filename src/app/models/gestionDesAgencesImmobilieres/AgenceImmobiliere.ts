import { EntiteDeBase } from "../EntiteDeBase";
import { AgentImmobilier } from "../gestionDesComptes/AgentImmobilier";

export class AgenceImmobiliere extends EntiteDeBase {

  id: number;
  nomAgence: string;
  adresse: string;
  telephone: string;
  adresseEmail: string;
  heureOuverture!: string;
  heureFermeture!: string;
  estCertifie: boolean;
  etatAgence: boolean;
  agentImmobilier!: AgentImmobilier;

  constructor(){
    super();
    this.id = 0;
    this.nomAgence = '';
    this.adresse = '';
    this.telephone = '';
    this.adresseEmail = '';
    this.estCertifie = true;
    this.etatAgence = true;
  }
}
