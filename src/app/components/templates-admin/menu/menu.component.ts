import { Component, OnInit } from '@angular/core';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: any;
  activeLink: any;

  constructor(
    private personneService: PersonneService,
    private behaviorService: BehaviorService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.behaviorService.activeLink$.subscribe((donnee) => {
      this.activeLink = donnee;
    });
    console.log(this.activeLink);
  }

  setActiveLink(link: string) {
    this.activeLink = link;
    this.behaviorService.setActiveLink(this.activeLink);
  }

  seDeconnecter(): void {
    this.personneService.deconnexion();
  }

}
