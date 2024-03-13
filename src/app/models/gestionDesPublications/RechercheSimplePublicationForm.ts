import { Quartier } from "../gestionDesBiensImmobiliers/Quartier";
import { TypeDeBien } from "../gestionDesBiensImmobiliers/TypeDeBien";

export class RechercheSimplePublicationForm {
  typeDeTransaction!: string;
  typeDeBien!: TypeDeBien;
  quartier!: Quartier;
}
