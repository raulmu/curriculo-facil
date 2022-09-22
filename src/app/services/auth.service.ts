import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  first,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { NavigateService } from './navigate.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userDoc: AngularFirestoreDocument<User> | null = null;
  userData: User | null | undefined = null;
  public user: BehaviorSubject<User | null | undefined> = new BehaviorSubject(
    this.userData
  );
  didLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private userUID: string = '';

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public auth: AngularFireAuth,
    public ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private _nav: NavigateService
  ) {
    this.auth.authState.subscribe((user) => {
      if (user && user.uid) {
        this.userUID = user.uid;
        !this.didLoggedIn.value && this.didLoggedIn.next(true);
        this._nav.navigateTo('/');
      } else {
        this.userData = null;
        this.user.next(this.userData);
        this.didLoggedIn.value && this.didLoggedIn.next(false);
      }
    });
    this.didLoggedIn.subscribe((loggedIn) => {
      loggedIn &&
        this.userUID &&
        !this.userData &&
        this.getUserData(
          this.userUID,
          'didLoggedInSubscribeConstructor'
        ).subscribe();
    });
  }

  async signIn(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        !this.didLoggedIn.value && this.didLoggedIn.next(true);
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
        this._snackBar.open(
          'Algo errado não está certo: login falhou',
          'fechar'
        );
      });
  }

  setUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
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
        const user = result.user!;
        const userAuth: User = {
          uid: user.uid!,
          email: user.email!,
          displayName: user.displayName!,
          photoURL: user.photoURL!,
          emailVerified: user.emailVerified!,
          loginMode: 'email-password',
        };
        this.setUserData(userAuth);
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
    const isLoggedIn =
      !!this.didLoggedIn.value &&
      !!this.userUID &&
      !!this.userData &&
      !!this.userData.emailVerified;
    console.log(
      `${isLoggedIn} - ${!!this.didLoggedIn.value} - ${!!this
        .userUID} - ${!!this.userData} `
    );
    return isLoggedIn;
  }

  async googleLogin() {
    var provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider, 'google-oauth').catch((error: any) => {
      this._snackBar.open(
        'Algo errado não está certo: login google falhou',
        'fechar'
      );
      console.log('Something went wrong: ', error);
    });
  }

  async signOut() {
    return this.auth.signOut().then(() => {
      this.userData = null;
      this.user.next(this.userData);
      this.didLoggedIn.value && this.didLoggedIn.next(false);
    });
  }

  public async deleteUser() {
    if (this.userData) {
      const userDataToDelete = this.userData;
      return this.auth.currentUser
        .then((user) => {
          this.deleteCurriloListData(userDataToDelete.curriculosUID!).then(
            (_) => {
              this.deleteUserData(userDataToDelete.uid).then((_) => {
                user?.delete();
                this.userData = null;
                this.user.next(this.userData);
                this.didLoggedIn.value && this.didLoggedIn.next(false);
              });
            }
          );
        })
        .catch((err) => {
          this._nav.navigateTo('/excluir-perfil');
        });
    }
    return Promise.reject('No userData to delete');
  }

  deleteUserData(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );
    return userRef.delete();
  }

  deleteCurriloListData(curriloUID: string) {
    const curriloListRef: AngularFirestoreDocument<any> = this.afs.doc(
      `curriculos/${curriloUID}`
    );
    return curriloListRef.delete();
  }

  private async oAuthLogin(
    provider: any,
    loginMode: 'google-oauth' | 'email-password'
  ) {
    return this.auth
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        let userAuth: User | null = null;
        if (user) {
          userAuth = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          };
        }
        this.getUserData(userAuth?.uid!, 'oAuthLogin')
          .subscribe((doc: any) => {
            const userStored = doc ? doc.data() : null;
            let mergedUser: User = {
              uid: userAuth?.uid!,
              email: userAuth?.email!,
              displayName: userAuth?.displayName!,
              photoURL: userAuth?.photoURL!,
              emailVerified: userAuth?.emailVerified!,
              loginMode: 'google-oauth',
            };
            if (userStored)
              mergedUser = {
                uid: userAuth?.uid!,
                email: userAuth?.email!,
                displayName: userStored.displayName,
                photoURL: userStored.photoURL,
                emailVerified: userAuth!.emailVerified,
                loginMode: 'google-oauth',
                curriculosUID: userStored.curriculosUID,
              };
            this.setUserData(mergedUser);
            this.user.next(mergedUser);
            this.userData = mergedUser;
            this.didLoggedIn.next(true);
            this._nav.navigateTo('/');
          })
          .unsubscribe();
      })
      .catch((error) => {
        this._snackBar.open(
          'Algo errado não está certo: login oAuth falhou',
          'fechar'
        );
        console.log('Something went wrong: ', error);
      });
  }

  getUserData(uid: string | null, origem: string) {
    //console.log({ uid });
    //console.log({ origem });
    const userUid = uid ? uid : '';
    const userRef: AngularFirestoreDocument<any> = this.afs
      .collection('users')
      .doc(userUid);
    return userRef.get().pipe(
      tap((userData) => {
        this.userData = userData.data();
        //console.log({ 'this.userData': this.userData, origem });
        this.user.next(this.userData);
      })
    );
  }

  getUser(): Promise<any> {
    return firstValueFrom(this.auth.authState.pipe(first()));
  }
}
