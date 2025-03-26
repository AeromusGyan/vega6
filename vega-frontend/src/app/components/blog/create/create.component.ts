import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgFor, NgIf} from "@angular/common";
import {ServicesService} from "../../../services.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  blogForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  statusOptions = ['Draft', 'Published', 'Archived'];

  router = inject(Router);

  constructor(private fb: FormBuilder, private service: ServicesService) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      status: ['Draft', [Validators.required]],
      image: [null, [Validators.required]]
    });

    // Auto-generate slug from title
    this.blogForm.get('title')?.valueChanges.subscribe(title => {
      if (title && this.blogForm.get('slug')?.pristine) {
        const slug = title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        this.blogForm.get('slug')?.setValue(slug);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.blogForm.patchValue({image: file});

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formData = new FormData();

      // Append all form fields to FormData
      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('slug', this.blogForm.get('slug')?.value);
      formData.append('description', this.blogForm.get('description')?.value);
      formData.append('status', this.blogForm.get('status')?.value);

      // Append the file if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.service.createBlog(formData).subscribe({
        next: (response) => {
          console.log('Blog created successfully', response);
          // Reset form after successful submission
          this.blogForm.reset({
            status: 'Draft'
          });
          this.previewUrl = null;
          this.selectedFile = null;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating blog', error);
        }
      });

    } else {
      // Mark all fields as touched to show validation messages
      this.blogForm.markAllAsTouched();
    }
  }
}
