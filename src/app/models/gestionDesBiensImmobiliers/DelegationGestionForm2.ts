import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { Quartier } from './Quartier';
import { TypeDeBien } from './TypeDeBien';
export class DelegationGestionForm2 {

  typeDeBien!: TypeDeBien;
  matriculeProprietaire!: string;
  matriculeBienImmo!: string;
  categorie!: string;
  quartier!: Quartier;
  agenceImmobiliere!: AgenceImmobiliere;
  adresse!: string;
  surface!: number;
  description!: Text;

  constructor() {
  }
}
