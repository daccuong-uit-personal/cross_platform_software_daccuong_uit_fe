import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '@fe/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: { user: () => null } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep first four tabs visible by default', () => {
    expect(component.visibleTabs().length).toBe(4);
    expect(component.hiddenTabs().length).toBeGreaterThan(0);
  });

  it('should activate hidden tab and bring it into visible tabs when selected', () => {
    const hiddenTab = component.hiddenTabs()[0];
    component.selectTab(hiddenTab.id);

    expect(component.activeTab()).toBe(hiddenTab.id);
    expect(component.visibleTabs().some((tab) => tab.id === hiddenTab.id)).toBeTrue();
  });
});
