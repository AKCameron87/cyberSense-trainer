import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerPanel } from './answer-panel';

describe('AnswerPanel', () => {
  let component: AnswerPanel;
  let fixture: ComponentFixture<AnswerPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
