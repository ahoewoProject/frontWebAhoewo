import { EntiteDeBase } from "../EntiteDeBase";
import { BienImmobilier } from "./BienImmobilier";

export class Utilitaire extends EntiteDeBase {

  id: number;
  wifi!: boolean;
  laveLinge!: boolean;
  cuisine!: boolean;
  refrigirateur!: boolean;
  ferARepasser!: boolean;
  espaceDeTravail!: boolean;
  parking!: boolean;
  eau!: boolean;
  electricite!: boolean;
  toilette!: boolean;
  nombreGarages!: number;
  nombreSallesDeBains!: number;
  nombreChambres!: number;
  nombrePieces!: number;
  nombreAppartements!: number;
  bienImmobilier!: BienImmobilier;

  constructor() {
      super();
      this.id = 0;
  }
}
