import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindRide } from './find-ride';

describe('FindRide', () => {
  let component: FindRide;
  let fixture: ComponentFixture<FindRide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindRide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindRide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
