import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentChildProfileComponent } from './parent-child-profile.component';

describe('ParentChildProfileComponent', () => {
  let component: ParentChildProfileComponent;
  let fixture: ComponentFixture<ParentChildProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentChildProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentChildProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
