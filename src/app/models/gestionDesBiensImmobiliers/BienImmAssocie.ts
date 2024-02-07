import { BienImmobilier } from "./BienImmobilier";

export class BienImmobilierAssocie extends BienImmobilier {

  bienImmobilier: BienImmobilier
  constructor() {
    super();
    this.id = 0;
    this.bienImmobilier = new BienImmobilier();
  }
}
