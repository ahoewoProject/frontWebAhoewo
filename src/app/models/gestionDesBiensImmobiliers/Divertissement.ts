import { EntiteDeBase } from "../EntiteDeBase";
import { BienImmobilier } from "./BienImmobilier";

export class Divertissement extends EntiteDeBase {

  id: number;
  television!: boolean;
  piscine!: boolean;
  jardin!: boolean;
  salleDeSport!: boolean;
  bienImmobilier!: BienImmobilier;

  constructor() {
      super();
      this.id = 0;
  }
}
