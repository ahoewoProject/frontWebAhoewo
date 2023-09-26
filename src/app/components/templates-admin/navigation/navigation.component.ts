import { Component, OnInit } from '@angular/core';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

  constructor(private personneService: PersonneService)
  {

  }

  ngOnInit(): void {

  }

  seDeconnecter(): void {
    this.personneService.logout();
  }
}
