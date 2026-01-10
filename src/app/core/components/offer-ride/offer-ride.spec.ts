import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRide } from './offer-ride';

describe('OfferRide', () => {
  let component: OfferRide;
  let fixture: ComponentFixture<OfferRide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferRide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferRide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
