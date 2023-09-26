import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedDePageComponent } from './pied-de-page.component';

describe('PiedDePageComponent', () => {
  let component: PiedDePageComponent;
  let fixture: ComponentFixture<PiedDePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiedDePageComponent]
    });
    fixture = TestBed.createComponent(PiedDePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
