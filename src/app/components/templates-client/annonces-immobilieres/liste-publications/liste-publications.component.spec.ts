import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePublicationsComponent } from './liste-publications.component';

describe('ListePublicationsComponent', () => {
  let component: ListePublicationsComponent;
  let fixture: ComponentFixture<ListePublicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListePublicationsComponent]
    });
    fixture = TestBed.createComponent(ListePublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
