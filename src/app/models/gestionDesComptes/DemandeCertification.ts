import { EntiteDeBase } from "../EntiteDeBase";
import { Personne } from "./Personne";

export class DemandeCertification extends EntiteDeBase {

  id: number;
  dateDemande!: Date;
  documentJustificatif: string;
  statutDemande:number;
  personne!: Personne;

  constructor(){
    super();
    this.id = 0;
    this.documentJustificatif = '';
    this.statutDemande = 0;
    this.personne = new Personne();
  }
}
