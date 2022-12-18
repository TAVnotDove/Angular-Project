import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from '../validators/confirm-passwords.validator';
import { emailValidator } from '../validators/email.validator';
import { passwordValidator } from '../validators/password.validator';
import { trimmedLengthValidator } from '../validators/trimmed-length.validator';
import { ThemesService } from '../services/themes.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  error: string | null = null

  form = this.fb.group({
    username: ["tav", [Validators.required, trimmedLengthValidator(3)]],
    email: ["tav@tav.bg", [Validators.required, emailValidator()]],
    passwords: this.fb.group(
      {
        password: ["123Aa!", [Validators.required, passwordValidator()]],
        confirmPassword: ["123Aa!"]
      }, {
        validators: [confirmPasswordValidator("password", "confirmPassword")]
      }
    ),
  })

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private themesService: ThemesService){}

  register(): void {
    const userData = this.form.value
    
    this.userService.registerUser({
      username: userData.username!,
      email: userData.email!,
      password: userData.passwords?.password!
    }).subscribe({
        next: (v: any) => {
          localStorage.setItem("user", JSON.stringify(v));
          
          this.themesService.setTheme({theme: "lightTheme"}, v.accessToken).subscribe({
            next: () => {
              this.router.navigate(["/"]);
            },
            error: (e) => {
              console.error(e)
            }
          })
        },
        error: (e) => {
          if (e.status === 0) {
            this.error = "The server failed to connect."
          } else if (e.status === 409) {
            this.error = "Email is already registered."
          } else {
            console.error(e)
          }
        }
    })

  }
}
