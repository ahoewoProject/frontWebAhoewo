import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSiteComponent } from './navigation-site.component';

describe('NavigationSiteComponent', () => {
  let component: NavigationSiteComponent;
  let fixture: ComponentFixture<NavigationSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationSiteComponent]
    });
    fixture = TestBed.createComponent(NavigationSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
