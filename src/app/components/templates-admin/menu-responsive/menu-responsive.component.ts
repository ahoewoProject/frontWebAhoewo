import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-menu-responsive',
  templateUrl: './menu-responsive.component.html',
  styleUrls: ['./menu-responsive.component.css']
})
export class MenuResponsiveComponent implements OnInit{

  user:any;
  activeLink: string = localStorage.getItem('activeLink') || '';
  constructor(
    private personneService: PersonneService,
    private cookieService: CookieService
  ){
    const userCookie = this.cookieService.get('user');
    this.user = JSON.parse(userCookie);
  }

  ngOnInit(): void {

  }

  setActiveLink(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }

  seDeconnecter(): void{
    this.personneService.logout();
  }
}
