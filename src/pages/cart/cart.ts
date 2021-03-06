import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from "../../providers/user-data/user-data";
import { CaseDataProvider } from "../../providers/case-data/case-data";
import { UtilProvider } from "../../providers/util/util";
import { CheckoutPage } from "../checkout/checkout";
import { PastOrdersPage } from "../past-orders/past-orders";

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage implements OnInit{
  userCart: any = null;
  userFav: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userDataProvider: UserDataProvider,
              private caseDataProvider: CaseDataProvider, private utilProvider: UtilProvider,
              private modalCtrl: ModalController, private events: Events) {
    this.userDataProvider.getUserCart()
      .subscribe(userCart => {
        this.userCart = this.objToArr(userCart);
      });
    this.userDataProvider.getUserFav()
      .subscribe(userFav => {
        this.userFav = this.objToArr(userFav);
      });
  }

  ngOnInit() {
    // Subscribe to the user cart event at the tabs class
    // this.events.subscribe('data:userCart', (cart) => {
    //   this.userCart = this.objToArr(cart);
    // });
  }

  objToArr(obj) {
    const newArr = [];
    for (let key in obj) {
      this.caseDataProvider.getCaseById(key).take(1).subscribe(caseData => {
        caseData['$key'] = key;
        newArr.push(caseData);
      })
    }
    return newArr;
  }

  pastOrders() {
    return this.navCtrl.push(PastOrdersPage);
  }

  checkoutCart() {
    const modal = this.modalCtrl.create(CheckoutPage);

    modal.onDidDismiss(data => {
      if (data && data.ordered) this.utilProvider.presentToast('Your order has been processed');
      else this.utilProvider.presentToast('Your order was not completed');
    });
    modal.present();
  }

}
