import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ServersService } from '../../servers.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {  } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' }); //发送post请求头部
  public api = 'Account/Login';
  public systemName = this.server.systemName;
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, public http: HttpClient, public router: Router, public server: ServersService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      UserName: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let options = {
      api: this.api,
      params: this.validateForm.value
    }
    this.router.navigate(['/dashboard/']);
    // this.http.post(environment.projectUrl + options.api, JSON.stringify(options.params), { headers: this.headers }).subscribe((data: any) => {
    //   //  console.log(data)
    //   if (data.msg == '登录成功！') {
        
    //     //发送菜单数据到server
    //     // this.server.postMenuJson(data.menuJson);
    //   }
    // });
  }
}
