import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedDePageSiteComponent } from './pied-de-page-site.component';

describe('PiedDePageSiteComponent', () => {
  let component: PiedDePageSiteComponent;
  let fixture: ComponentFixture<PiedDePageSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiedDePageSiteComponent]
    });
    fixture = TestBed.createComponent(PiedDePageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
