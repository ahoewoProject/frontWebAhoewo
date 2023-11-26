import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemarcheursComponent } from './demarcheurs.component';

describe('DemarcheursComponent', () => {
  let component: DemarcheursComponent;
  let fixture: ComponentFixture<DemarcheursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemarcheursComponent]
    });
    fixture = TestBed.createComponent(DemarcheursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
