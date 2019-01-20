import { Component, Input, OnInit } from '@angular/core';
import { Case } from "../../shared/interfaces";
import { CaseDataProvider } from "../../providers/case-data/case-data";
import { UtilProvider } from "../../providers/util/util";

@Component({
  selector: 'cart-item',
  templateUrl: 'cart-item.html'
})
export class CartItemComponent implements OnInit{
  @Input('case') case: Case;
  @Input('type') cartType: string;
  isAvailableText: string = "Available";
  addToDBText: string;
 
  constructor(private caseDataProvider: CaseDataProvider, private utilProvider: UtilProvider) {

  }

  ngOnInit() {
    if (!this.case.isAvailable) this.isAvailableText = 'Not Available';
    else this.isAvailableText = 'Available';

    if (this.cartType == 'cart') {
      this.addToDBText = 'Watch';
    } else if (this.cartType == 'watch') {
      this.addToDBText = 'Add to Cart'
    }
  }

  removeCaseFromUserDB() {
    if (this.cartType == 'cart') {
      this.caseDataProvider.removeCaseFromCart(this.case.$key)
        .then(() => this.utilProvider.presentToast(`Removed ${this.case.name} from cart`),
          () => this.utilProvider.presentToast(`Error removing ${this.case.name} from cart`));
    } else if (this.cartType == 'watch') {
      this.caseDataProvider.removeCaseFromFav(this.case.$key)
        .then(() => this.utilProvider.presentToast(`Removed ${this.case.name} from watch later`),
          () => this.utilProvider.presentToast(`Error removing ${this.case.name} from watch later`));
    }
  }

  addToUserDB() {
    if (this.cartType == 'cart') {
      this.caseDataProvider.addCaseToFav(this.case.$key)
        .then(() => this.utilProvider.presentToast(`Successfully added  ${this.case.name} to cart`),
          () => this.utilProvider.presentToast(`Error adding ${this.case.name} to cart`))
        .then(() => this.caseDataProvider.removeCaseFromCart(this.case.$key));
    } else if (this.cartType == 'watch') {
      this.caseDataProvider.addCaseToCart(this.case.$key)
        .then(() => this.utilProvider.presentToast(`Successfully added ${this.case.name} to cart`),
          () => this.utilProvider.presentToast(`Error adding ${this.case.name} to cart`))
        .then(() => this.caseDataProvider.removeCaseFromFav(this.case.$key));
    }
  }


}
