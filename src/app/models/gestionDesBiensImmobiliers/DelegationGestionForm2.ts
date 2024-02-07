import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Quartier } from './Quartier';
import { Ville } from './Ville';
import { Region } from './Region';
import { Pays } from './Pays';
import { TypeDeBien } from './TypeDeBien';
export class DelegationGestionForm2 {

  typeDeBien!: TypeDeBien;
  matriculeProprietaire!: string;
  matriculeBienImmo!: string;
  categorie!: string;
  pays!: Pays;
  region!: Region;
  ville!: Ville;
  quartier!: Quartier;
  agenceImmobiliere!: AgenceImmobiliere;
  adresse!: string;
  surface!: number;
  description!: Text;

  constructor() {
  }
}
