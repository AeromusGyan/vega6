import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ServicesService} from "../../services.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private service: ServicesService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profileImage: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.signupForm.patchValue({profileImage: file});

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = new FormData();

      formData.append('name', this.signupForm.get('name')?.value);
      formData.append('email', this.signupForm.get('email')?.value);
      formData.append('password', this.signupForm.get('password')?.value);

      if (this.selectedFile) {
        formData.append('profile', this.selectedFile, this.selectedFile.name);
      }

      this.service.signup(formData).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
