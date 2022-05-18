import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import {LandingRoutingModule} from "./landing-routing.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {LandingComponent} from "./landing.component";
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    AuthComponent,
    LandingComponent
  ],
    imports: [
        CommonModule,
        LandingRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class LandingModule { }
