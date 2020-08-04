import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';

export interface DialogData {
  application: string;
  password: string;
}

export interface TableElement {
  id: number;
  web_address: string;
  password: string;
  isPasswordShown: boolean;
}

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss'],
})
export class PasswordListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'application', 'password', 'actions'];
  dataSource: TableElement[];

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private userService: UserService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http.get('http://localhost:3000/api/passwords').subscribe((elements: TableElement[]) => {
      this.dataSource = elements;
      this.dataSource.forEach(element => {
        element.isPasswordShown = false;
      });
    });
  }

  addPassword(): void {
    const dialogRef = this.dialog.open(NewPasswordDialogComponent, {
      width: '500px',
      data: {application: '', password: ''}
    });

    dialogRef.afterClosed().subscribe(
      data => data && this.http.post('http://localhost:3000/api/passwords', data).subscribe(() => {
        this.fetchData();
      }),
    );
  }

  removePassword(id: number) {
    this.http.delete(`http://localhost:3000/api/passwords/${id}`).subscribe(() => this.fetchData());
  }

  showPassword(id: number, index: number) {
    const element = this.dataSource[index];
    if (!element.isPasswordShown) {
      this.http.get(`http://localhost:3000/api/passwords/${id}`).subscribe((password: {password: string}) => {
        element.password = password.password;
        element.isPasswordShown = !element.isPasswordShown;
      });
    } else {
      this.fetchData();
      element.isPasswordShown = !element.isPasswordShown;
    }
  }
}

@Component({
  selector: 'app-new-password-dialog-component',
  templateUrl: 'new-password-dialog.html',
})
export class NewPasswordDialogComponent implements OnInit {
  newPasswordForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit() {
    this.newPasswordForm = this.fb.group({
      application: '',
      password: ''
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.newPasswordForm.value);
  }

}
