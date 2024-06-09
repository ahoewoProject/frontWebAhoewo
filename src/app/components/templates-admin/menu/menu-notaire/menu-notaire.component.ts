import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-notaire',
  templateUrl: './menu-notaire.component.html',
  styleUrls: ['./menu-notaire.component.css']
})
export class MenuNotaireComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
  }
}
