import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { Router } from 'express';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule,MatCardModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  constructor() {
}

login(){

}
}
