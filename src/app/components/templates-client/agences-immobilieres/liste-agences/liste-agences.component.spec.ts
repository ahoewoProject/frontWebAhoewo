import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAgencesComponent } from './liste-agences.component';

describe('ListeAgencesComponent', () => {
  let component: ListeAgencesComponent;
  let fixture: ComponentFixture<ListeAgencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeAgencesComponent]
    });
    fixture = TestBed.createComponent(ListeAgencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
