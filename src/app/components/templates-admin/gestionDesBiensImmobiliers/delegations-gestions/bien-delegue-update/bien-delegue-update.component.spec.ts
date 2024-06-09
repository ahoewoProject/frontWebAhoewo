import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienDelegueUpdateComponent } from './bien-delegue-update.component';

describe('BienDelegueUpdateComponent', () => {
  let component: BienDelegueUpdateComponent;
  let fixture: ComponentFixture<BienDelegueUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BienDelegueUpdateComponent]
    });
    fixture = TestBed.createComponent(BienDelegueUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
