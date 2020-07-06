import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeBoardComponent } from './volume-board.component';

describe('VolumeBoardComponent', () => {
  let component: VolumeBoardComponent;
  let fixture: ComponentFixture<VolumeBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
