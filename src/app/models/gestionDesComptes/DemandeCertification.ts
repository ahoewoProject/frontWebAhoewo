import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "./Personne";

export class DemandeCertification extends EntiteDeBase {

  id: number;
  codeCertification!: string;
  dateDemande!: Date;
  documentJustificatif: string;
  carteCfe: string;
  statutDemande: number;
  personne: Personne;
  agenceImmobiliere: AgenceImmobiliere;

  constructor(){
    super();
    this.id = 0;
    this.documentJustificatif = '';
    this.carteCfe = '';
    this.statutDemande = 0;
    this.personne = new Personne();
    this.agenceImmobiliere = new AgenceImmobiliere();
  }
}
