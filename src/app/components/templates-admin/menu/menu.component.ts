import { Component, OnInit } from '@angular/core';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: any;
  activeLink: string = localStorage.getItem('activeLink') || '';
  
  constructor(
    private personneService: PersonneService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {

  }

  setActiveLink(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }

  seDeconnecter(): void {
    this.personneService.deconnexion();
  }

}
