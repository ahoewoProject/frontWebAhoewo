import { EntiteDeBase } from "../EntiteDeBase";
import { BienImmobilier } from "./BienImmobilier";

export class Confort extends EntiteDeBase {

  id: number;
  chauffage!: boolean;
  climatisation!: boolean;
  nombreFauteuils!: number;
  nombreLits!: number;
  secheCheveux!: boolean;
  bienImmobilier!: BienImmobilier;

  constructor() {
      super();
      this.id = 0;
  }
}
