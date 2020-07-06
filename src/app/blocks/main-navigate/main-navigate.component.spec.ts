import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavigateComponent } from './main-navigate.component';

describe('MainNavigateComponent', () => {
  let component: MainNavigateComponent;
  let fixture: ComponentFixture<MainNavigateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNavigateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
