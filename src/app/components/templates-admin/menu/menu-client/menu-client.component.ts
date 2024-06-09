import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-client',
  templateUrl: './menu-client.component.html',
  styleUrls: ['./menu-client.component.css']
})
export class MenuClientComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
  }
}
