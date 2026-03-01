import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeSite } from './fake-site';

describe('FakeSite', () => {
  let component: FakeSite;
  let fixture: ComponentFixture<FakeSite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeSite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeSite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
