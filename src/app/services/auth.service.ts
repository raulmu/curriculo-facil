import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public auth: AngularFireAuth,
    private router: Router
  ) {
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/perfil');
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
      });
  }

  emailSignup(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((value) => {
        console.log('Sucess', value);
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
      });
  }

  googleLogin() {
    var provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then((value: any) => {
        console.log('Sucess', value), this.router.navigateByUrl('/perfil');
      })
      .catch((error: any) => {
        console.log('Something went wrong: ', error);
      });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  private oAuthLogin(provider: any) {
    return this.auth.signInWithPopup(provider);
  }
}
