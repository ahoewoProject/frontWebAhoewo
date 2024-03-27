import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontWebAhoewo';

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {}

  ngOnInit() {
    this.config.setTranslation(
      {
        firstDayOfWeek: 0,
        dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
        dayNamesShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
        dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
        monthNames: [ "Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre" ],
        monthNamesShort: [ "Jan", "Fév", "Mar", "Avr", "Mai", "Juin","Juil", "Aoû", "Sep", "Oct", "Nov", "Déc" ],
        today: 'Ajourd\'hui',
        clear: 'Effacer',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Sem'
      }
    )
  }
}
