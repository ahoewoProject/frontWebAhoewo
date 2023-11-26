import { EntiteDeBase } from "../EntiteDeBase";
import { ResponsableAgenceImmobiliere } from "../gestionDesComptes/ResponsableAgenceImmobiliere";

export class AgenceImmobiliere extends EntiteDeBase {

  id: number;
  logoAgence: string;
  codeAgence: string;
  nomAgence: string;
  adresse: string;
  telephone: string;
  adresseEmail: string;
  heureOuverture!: string;
  heureFermeture!: string;
  estCertifie: boolean;
  etatAgence: boolean;

  constructor(){
    super();
    this.id = 0;
    this.logoAgence = '';
    this.codeAgence = '';
    this.nomAgence = '';
    this.adresse = '';
    this.telephone = '';
    this.adresseEmail = '';
    this.estCertifie = false;
    this.etatAgence = true;
  }
}
