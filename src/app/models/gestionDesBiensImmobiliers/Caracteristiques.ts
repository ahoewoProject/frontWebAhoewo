import { EntiteDeBase } from "../EntiteDeBase";
import { BienImmobilier } from "./BienImmobilier";

export class Caracteristiques extends EntiteDeBase {

  id!: number;
  bienImmobilier!: BienImmobilier;
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

  constructor() {
      super();
  }
}
