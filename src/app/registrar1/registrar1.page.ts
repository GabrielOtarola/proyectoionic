import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-registrar1',
  templateUrl: './registrar1.page.html',
  styleUrls: ['./registrar1.page.scss'],
})
export class Registrar1Page implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\\d{4,}).+$')
      ]],
      age: ['', [Validators.required, Validators.min(14), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(280)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      gender: ['', Validators.required],
      activityLevel: ['', Validators.required]
    });

    this.dbService.initDB().then(() => {
      console.log('Base de datos inicializada.');
    }).catch(error => {
      console.error('Error inicializando la base de datos', error);
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const success = await this.dbService.registerUser(formData);
      if (success) {
        alert('Usuario registrado con éxito.');
        this.navCtrl.navigateForward('/login1');
      } else {
        alert('Hubo un problema al registrar el usuario.');
      }
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }

  handleBackButton() {
    this.navCtrl.back();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors?.['required']) {
      return 'Este campo es obligatorio';
    }
    return '';
  }
}
