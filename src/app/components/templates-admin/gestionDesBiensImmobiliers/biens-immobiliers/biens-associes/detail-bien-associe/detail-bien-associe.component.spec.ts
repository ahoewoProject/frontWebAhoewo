import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBienAssocieComponent } from './detail-bien-associe.component';

describe('DetailBienAssocieComponent', () => {
  let component: DetailBienAssocieComponent;
  let fixture: ComponentFixture<DetailBienAssocieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailBienAssocieComponent]
    });
    fixture = TestBed.createComponent(DetailBienAssocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
