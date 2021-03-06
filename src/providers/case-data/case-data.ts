import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthProvider } from "../auth/auth";
import { Observable } from "rxjs";
import { Case } from "../../shared/interfaces";

@Injectable()
export class CaseDataProvider {

  constructor(public http: HttpClient, private db: AngularFireDatabase, private authProvider: AuthProvider) {
  }


  getCases() {
    return this.db.object('/cases').valueChanges();
  }

  addCaseToDb(caseData) {
    return this.db.database.ref('/cases').push(caseData);
  }

  addCaseToCart(caseId) {
    const userId = this.authProvider.userID();
    return this.db.database.ref(`/userCarts/${userId}/${caseId}`).set(true);
  }

  removeCaseFromCart(caseId) {
    const userId = this.authProvider.userID();
    return this.db.database.ref(`/userCarts/${userId}/${caseId}`).remove();
  }

  addCaseToFav(caseId) {
    const userId = this.authProvider.userID();
    return this.db.database.ref(`/userFavCarts/${userId}/${caseId}`).set(true);
  }

  updateCaseLocation(caseId, caseLocation) {
    return this.db.database.ref(`/cases/${caseId}/lastLocation`).set(caseLocation);
  }

  updateCaseAvailability(caseId, isAvailable) {
    return this.db.database.ref(`/cases/${caseId}/isAvailable`).set(isAvailable);
  }

  removeCaseFromFav(caseId) {
    const userId = this.authProvider.userID();
    return this.db.database.ref(`/userFavCarts/${userId}/${caseId}`).remove();
  }

  getCaseById(caseId: string): Observable<Case | {}> {
    return this.db.object(`/cases/${caseId}`).valueChanges();
  }

  getQueueByCase(caseId: string) {
    return this.db.object(`/caseQueues/${caseId}/queueCount`).valueChanges();
  }

  isCaseInCart(caseId) {
    const userId = this.authProvider.userID();
    this.db.database.ref(`/userCarts/${userId}/${caseId}`)
      .once('value', snapshot => {
        // If success and snapshot exists
        if (snapshot.exists()) {
          return true;
        }
        return false;
      }, () => {
        // If failure
        return false;
      })
  }

}
