import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomonitorAlertComponent } from './automonitor-alert.component';

describe('AutomonitorAlertComponent', () => {
  let component: AutomonitorAlertComponent;
  let fixture: ComponentFixture<AutomonitorAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomonitorAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomonitorAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
