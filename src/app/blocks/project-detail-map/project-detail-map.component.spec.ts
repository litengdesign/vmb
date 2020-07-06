import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailMapComponent } from './project-detail-map.component';

describe('ProjectDetailMapComponent', () => {
  let component: ProjectDetailMapComponent;
  let fixture: ComponentFixture<ProjectDetailMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
