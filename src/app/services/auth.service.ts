import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { NavigateService } from './navigate.service';
import { doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userDoc: AngularFirestoreDocument<User> | null = null;
  user: Observable<User | null | undefined> | null = of(null);
  userData: User | null | undefined = null;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public auth: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private _nav: NavigateService
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userDoc = afs.doc<User>(`users/${user.uid}`);
        this.user = this.userDoc.valueChanges().pipe(
          tap((value) => {
            this.userData = value;
            localStorage.setItem('user', JSON.stringify(this.userData));
            JSON.parse(localStorage.getItem('user')!);
          })
        );
      } else {
        this.user = of(null);
        localStorage.setItem('user', 'null');
        this.userData = null;
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.auth.authState.subscribe((user) => {
          if (user) {
            this._nav.navigateTo('/');
          }
        });
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
        this._snackBar.open(
          'Algo errado não está certo: login falhou',
          'fechar'
        );
      });
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      curriculosUID: user.curriculosUID
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  signUp(email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail();
        this.setUserData(result.user);
      })
      .catch((error) => {
        this._snackBar.open(
          'Algo errado não está certo: cadastro falhou',
          'fechar'
        );
        console.log('Something went wrong: ', error);
      });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.auth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this._snackBar.open(
          'Verificação de email enviada, verifique',
          'fechar'
        );
        this._nav.navigateTo('/verificar-email');
      });
  }

  forgotPassword(passwordResetEmail: string) {
    return this.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this._snackBar.open(
          'Email para recuperação de senha enviado, verifique',
          'fechar'
        );
      })
      .catch((error) => {
        this._snackBar.open(
          'Algo errado não está certo: email de recuperação falhou',
          'fechar'
        );
      });
  }

  get isLoggedIn(): boolean {
    const user = this.userData;
    if (!user) return false;
    return user.emailVerified !== false ? true : false;
  }

  googleLogin() {
    var provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider).catch((error: any) => {
      this._snackBar.open(
        'Algo errado não está certo: login goole falhou',
        'fechar'
      );
      console.log('Something went wrong: ', error);
    });
  }

  async signOut() {
    return this.auth.signOut().then(() => {
      this.user = of(null);
      this.userData = null;
      localStorage.removeItem('user');
    });
  }

  private async oAuthLogin(provider: any) {
    return this.auth
      .signInWithPopup(provider)
      .then((result) => {
        () => this._nav.navigateTo('/');
      })
      .catch((error) => {
        this._snackBar.open(
          'Algo errado não está certo: login oAuth falhou',
          'fechar'
        );
        console.log('Something went wrong: ', error);
      });
  }
}
