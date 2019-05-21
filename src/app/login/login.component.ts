import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/guard/auth.service';
import { User } from '../../models/user.model';
import { ToastrService, Toast } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  error: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.user = new User();
    if (this.authService.isAdminLogged()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (!(this.user.username && this.user.password)) {
      return;
    }
    this.authService.login(this.user).subscribe(
      (data: User) => {
          this.router.navigate(['/']);
      },
      (error) => {
        this.toast.error(error.error);
        console.log(this.error);
      });
  }

}
