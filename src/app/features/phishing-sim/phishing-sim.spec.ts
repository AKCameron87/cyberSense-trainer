import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhishingSim } from './phishing-sim';

describe('PhishingSim', () => {
  let component: PhishingSim;
  let fixture: ComponentFixture<PhishingSim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhishingSim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhishingSim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
