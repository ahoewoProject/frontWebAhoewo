import { EntiteDeBase } from "./EntiteDeBase";

export class Notification extends EntiteDeBase {

  id: number;
  codeNotification!: string;
  titre!: string;
  message!: string;
  url!: string;
  sendTo!: string;
  lu!: Boolean;
  dateNotification!: Date;

  constructor() {
    super();
    this.id = 0;
  }
}
