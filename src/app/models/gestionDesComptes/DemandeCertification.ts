import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "./Personne";

export class DemandeCertification extends EntiteDeBase {

  id: number;
  dateDemande!: Date;
  documentJustificatif: string;
  statutDemande: number;
  personne: Personne;
  agenceImmobiliere: AgenceImmobiliere;

  constructor(){
    super();
    this.id = 0;
    this.documentJustificatif = '';
    this.statutDemande = 0;
    this.personne = new Personne();
    this.agenceImmobiliere = new AgenceImmobiliere();
  }
}
