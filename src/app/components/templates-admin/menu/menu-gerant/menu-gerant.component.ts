import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-gerant',
  templateUrl: './menu-gerant.component.html',
  styleUrls: ['./menu-gerant.component.css']
})
export class MenuGerantComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
  }
}
