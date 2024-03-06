import { EntiteDeBase } from "../EntiteDeBase";
import { Pays } from "../gestionDesBiensImmobiliers/Pays";
import { Quartier } from "../gestionDesBiensImmobiliers/Quartier";
import { Region } from "../gestionDesBiensImmobiliers/Region";
import { Ville } from "../gestionDesBiensImmobiliers/Ville";

export class AgenceImmobiliere extends EntiteDeBase {

  id: number;
  logoAgence: string;
  codeAgence: string;
  nomAgence: string;
  quartier: Quartier;
  adresse: string;
  telephone: string;
  adresseEmail: string;
  heureOuverture!: string;
  heureFermeture!: string;
  description!: Text;
  estCertifie: boolean;
  etatAgence: boolean;

  constructor(){
    super();
    this.id = 0;
    this.logoAgence = '';
    this.codeAgence = '';
    this.nomAgence = '';
    this.quartier = new Quartier();
    this.adresse = '';
    this.telephone = '';
    this.adresseEmail = '';
    this.estCertifie = false;
    this.etatAgence = true;
  }
}
