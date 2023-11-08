import { EntiteDeBase } from "../EntiteDeBase";
import { BienImmobilier } from "./BienImmobilier";

export class ImagesBienImmobilier extends EntiteDeBase {

  id: number;
  nomImage: string;
  bienImmobilier: BienImmobilier;

  constructor() {
    super();
    this.id = 0;
    this.nomImage = '';
    this.bienImmobilier = new BienImmobilier();
  }
}
