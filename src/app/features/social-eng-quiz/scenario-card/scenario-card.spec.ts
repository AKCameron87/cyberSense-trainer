import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioCard } from './scenario-card';

describe('ScenarioCard', () => {
  let component: ScenarioCard;
  let fixture: ComponentFixture<ScenarioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
