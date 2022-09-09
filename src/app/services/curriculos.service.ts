import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { CurriculoList } from './curriculoList';

@Injectable({
  providedIn: 'root',
})
export class CurriculosService {
  private curriculoListDoc: AngularFirestoreDocument<CurriculoList> | null =
    null;
  curriculoList: Observable<CurriculoList | undefined> | undefined = undefined;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public authService: AuthService
  ) {
    const user = this.authService.user;
    const userData = this.authService.userData;
    if (!userData) {
      return;
    }
    this.curriculoListDoc = afs.doc<CurriculoList>(
      `curriculos/${userData.uid}`
    );
    this.curriculoList = this.curriculoListDoc.valueChanges();
    if (!userData.curriculosUID) {
      const curriculosRef: AngularFirestoreDocument<any> = this.afs.doc(
        `curriculos/${userData.uid}`
      );
      const curriculosData: CurriculoList = {
        uid: userData.uid,
        ownerUID: userData.uid,
        curriculos: [],
      };
      curriculosRef
        .set(curriculosData, {
          merge: true,
        })
        .then((x: any) => {
          userData.curriculosUID = userData.uid;
          this.authService.setUserData(userData).then();
        });
    }
  }
}
