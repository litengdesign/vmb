import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAvatarComponent } from './main-avatar.component';

describe('MainAvatarComponent', () => {
  let component: MainAvatarComponent;
  let fixture: ComponentFixture<MainAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
