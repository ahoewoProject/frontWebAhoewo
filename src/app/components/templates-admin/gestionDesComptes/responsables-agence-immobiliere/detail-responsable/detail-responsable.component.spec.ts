import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResponsableComponent } from './detail-responsable.component';

describe('DetailResponsableComponent', () => {
  let component: DetailResponsableComponent;
  let fixture: ComponentFixture<DetailResponsableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailResponsableComponent]
    });
    fixture = TestBed.createComponent(DetailResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
