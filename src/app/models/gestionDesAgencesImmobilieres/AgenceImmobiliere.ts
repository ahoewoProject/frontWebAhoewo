import { EntiteDeBase } from "../EntiteDeBase";
import { ResponsableAgenceImmobiliere } from "../gestionDesComptes/ResponsableAgenceImmobiliere";

export class AgenceImmobiliere extends EntiteDeBase {

  id: number;
  logoAgence: string;
  nomAgence: string;
  adresse: string;
  telephone: string;
  adresseEmail: string;
  heureOuverture!: string;
  heureFermeture!: string;
  estCertifie: boolean;
  etatAgence: boolean;
  responsableAgenceImmobiliere!: ResponsableAgenceImmobiliere;

  constructor(){
    super();
    this.id = 0;
    this.logoAgence = '';
    this.nomAgence = '';
    this.adresse = '';
    this.telephone = '';
    this.adresseEmail = '';
    this.estCertifie = false;
    this.etatAgence = true;
  }
}
