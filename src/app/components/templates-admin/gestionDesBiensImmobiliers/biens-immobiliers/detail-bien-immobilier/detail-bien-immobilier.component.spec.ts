import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBienImmobilierComponent } from './detail-bien-immobilier.component';

describe('DetailBienImmobilierComponent', () => {
  let component: DetailBienImmobilierComponent;
  let fixture: ComponentFixture<DetailBienImmobilierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailBienImmobilierComponent]
    });
    fixture = TestBed.createComponent(DetailBienImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
