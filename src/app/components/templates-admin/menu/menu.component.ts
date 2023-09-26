import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: any;
  constructor(private cookieService: CookieService,
    private personneService: PersonneService) {
    const userCookie = this.cookieService.get('user');
    this.user = JSON.parse(userCookie);
  }

  ngOnInit(): void {

  }

  seDeconnecter(): void {
    this.personneService.logout();
  }

}
