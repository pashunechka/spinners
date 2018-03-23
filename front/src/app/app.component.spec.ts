import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {SpinnerListComponent} from './spinner-list/spinner-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from './app-material.module';
import {HttpService} from './http.service';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './data.service';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        SpinnerListComponent
      ],
      providers: [
        HttpService,
        DataService
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
