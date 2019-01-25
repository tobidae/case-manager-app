import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthProvider } from "../auth/auth";
import { firebaseConfig } from "../../config";

@Injectable()
export class UserDataProvider {
  headers: HttpHeaders;

  constructor(public http: HttpClient, private db: AngularFireDatabase, private authProvider: AuthProvider) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getUserCart() {
    const userId = this.authProvider.userID();
    return this.db.object(`/userCarts/${userId}`).valueChanges();
  }

  getUserFav() {
    const userId = this.authProvider.userID();
    return this.db.object(`/userFavCarts/${userId}`).valueChanges();
  }

  placeOrder() {
    const userId = this.authProvider.userID();
    return new Promise((resolve, reject) => {
      this.authProvider.userToken()
        .then(token => {
          if (token) {
            this.headers = this.headers.append('Authorization', `Bearer ${token}`);

            let projectId = firebaseConfig.projectId;

            this.http.post('https://us-central1-' + projectId + '.cloudfunctions.net/placeCaseOrder',
              JSON.stringify({
                userId: userId
              }), { headers: this.headers })
              .subscribe(data => {
                if (data['type'] == 'success') {
                  resolve(data);
                } else {
                  reject(data);
                }
              });
          }
        })
        .catch(err => {
          console.log(err);
          reject("You are unauthorized");
        });
    })
  }

  getUserInfo() {
    const userId = this.authProvider.userID();
    return this.db.object(`/userInfo/${userId}`).valueChanges();
  }

  setUserInfo(data: any, path?: any) {
    const userId = this.authProvider.userID();
    if (path) {
      return this.db.database.ref(`/userInfo/${userId}/${path}`).update(data);
    }
    return this.db.database.ref(`/userInfo/${userId}`).update(data);
  }
}
