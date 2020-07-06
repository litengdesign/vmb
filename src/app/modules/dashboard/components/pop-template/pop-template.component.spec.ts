import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopTemplateComponent } from './pop-template.component';

describe('PopTemplateComponent', () => {
  let component: PopTemplateComponent;
  let fixture: ComponentFixture<PopTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
