import { Component, OnInit, OnDestroy, createPlatformFactory } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  toggleValue = 'signIn';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: '',
      password: '',
      encryptionType: '',
    });
  }

  submit(option: string){
    if (option === 'signUp') {
      this.http.post('http://localhost:3000/api/signup', this.loginForm.value).subscribe(
        () => this.toggleValue = 'signIn'
      );
    } else {
      this.http.post('http://localhost:3000/api/signin', this.loginForm.value).subscribe(
        (data: User) => {
          this.userService.setUser(data);
          this.router.navigate(['/password-list']);
        }
      );
    }
  }

}
