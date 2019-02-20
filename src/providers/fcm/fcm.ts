import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthProvider } from "../auth/auth";

@Injectable()
export class FcmProvider {

  constructor(private firebase: Firebase, private authProvider: AuthProvider,
              private db: AngularFireDatabase,
              private platform: Platform) {}

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    return this.storeUserToken(token);
  }

  // Store the user's notification token in the database
  // WIth the token, the server can send alerts to the user based on events created
  storeUserToken(userToken) {
    const userId = this.authProvider.userID();
    return this.db.database.ref(`notificationTokens/${userId}`).set(userToken);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}