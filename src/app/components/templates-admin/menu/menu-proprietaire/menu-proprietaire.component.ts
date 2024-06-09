import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-proprietaire',
  templateUrl: './menu-proprietaire.component.html',
  styleUrls: ['./menu-proprietaire.component.css']
})
export class MenuProprietaireComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
  }
}
