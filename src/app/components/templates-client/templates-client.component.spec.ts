import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesClientComponent } from './templates-client.component';

describe('TemplatesClientComponent', () => {
  let component: TemplatesClientComponent;
  let fixture: ComponentFixture<TemplatesClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesClientComponent]
    });
    fixture = TestBed.createComponent(TemplatesClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
