import { Quartier } from "../gestionDesBiensImmobiliers/Quartier";
import { TypeDeBien } from "../gestionDesBiensImmobiliers/TypeDeBien";

export class RechercheAvanceePublicationForm {

  typeDeTransaction!: string;
  typeDeBien!: TypeDeBien;
  quartier!: Quartier;
  prixMin!: number;
  prixMax!: number;
  fraisDeVisite!: number;
  avance!: number;
  caution!: number;
  commission!: number;
  nombreChambres!: number;
  nombreChambresSalon!: number;
  nombreAppartements!: number;
  nombreBureaux!: number;
  nombreBoutiques!: number;
  nombreMagasins!: number;
  nombreEtages!: number;
  nombreGarages!: number;
  nombreSalons!: number;
  nombrePlacards!: number;
  nombreCuisineInterne!: number;
  nombreCuisineExterne!: number;
  nombreWCDoucheInterne!: number;
  nombreWCDoucheExterne!: number;
  eauTde!: boolean;
  eauForage!: boolean;
  electriciteCeet!: boolean;
  wifi!: boolean;
  cuisineInterne!: boolean;
  cuisineExterne!: boolean;
  wcDoucheInterne!: boolean
  wcDoucheExterne!: boolean;
  balcon!: boolean;
  climatisation!: boolean;
  piscine!: boolean;
  parking!: boolean;
  jardin!: boolean;
  terrasse!: boolean;
  ascenseur!: boolean;
  garage!: boolean;
  baieVitree!: boolean;
  solCarelle!: boolean;
  cashPowerPersonnel!: boolean;
  compteurAdditionnel!: boolean;
  compteurEau!: boolean;
  plafonne!: boolean;
  dalle!: boolean;
  placard!: boolean;
  aLetage!: boolean;
  toiletteVisiteur!: boolean
}
