import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Personne } from "../gestionDesComptes/Personne";
import { ImagesBienImmobilier } from "./ImagesBienImmobilier";
import { Pays } from "./Pays";
import { Quartier } from "./Quartier";
import { Region } from "./Region";
import { TypeDeBien } from "./TypeDeBien";
import { Ville } from "./Ville";

export class BienImmobilier extends EntiteDeBase {

  id: number;
  numeroIdentifiant: string;
  description!: Text;
  adresse: string;
  surface!: number;
  typeDeBien: TypeDeBien;
  pays: Pays;
  region: Region;
  ville: Ville;
  quartier: Quartier;
  personne: Personne;
  agenceImmobiliere!: AgenceImmobiliere;
  statutBien: string;
  etatBien: boolean;
  images!: ImagesBienImmobilier[];

  constructor() {
    super();
    this.id = 0;
    this.numeroIdentifiant = '';
    this.adresse = '';
    this.typeDeBien = new TypeDeBien();
    this.pays = new Pays();
    this.region = new Region();
    this.ville = new Ville();
    this.quartier = new Quartier();
    this.personne = new Personne();
    this.statutBien = '';
    this.etatBien = true;
  }
}
