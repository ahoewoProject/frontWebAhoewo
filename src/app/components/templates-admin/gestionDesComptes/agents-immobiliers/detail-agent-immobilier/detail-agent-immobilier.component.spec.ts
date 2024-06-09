import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAgentImmobilierComponent } from './detail-agent-immobilier.component';

describe('DetailAgentImmobilierComponent', () => {
  let component: DetailAgentImmobilierComponent;
  let fixture: ComponentFixture<DetailAgentImmobilierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailAgentImmobilierComponent]
    });
    fixture = TestBed.createComponent(DetailAgentImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
