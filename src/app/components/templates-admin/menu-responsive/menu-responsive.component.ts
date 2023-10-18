import { Component, OnInit } from '@angular/core';
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

  seDeconnecter(): void{
    this.personneService.deconnexion();
  }
}
