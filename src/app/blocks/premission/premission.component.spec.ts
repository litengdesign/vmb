import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremissionComponent } from './premission.component';

describe('PremissionComponent', () => {
  let component: PremissionComponent;
  let fixture: ComponentFixture<PremissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
