import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialEngQuiz } from './social-eng-quiz';

describe('SocialEngQuiz', () => {
  let component: SocialEngQuiz;
  let fixture: ComponentFixture<SocialEngQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialEngQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialEngQuiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
