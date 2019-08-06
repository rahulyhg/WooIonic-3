import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import * as WC from 'woocommerce-api';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetails {

  product: any;
  WooCommerce :any;
  reviews: any[] = [];
  toastCtrl: any;
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: Storage, 
    public toasCtrl: ToastController, 
    public modalCtrl: ModalController) 
    {
    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      // url: "http://localhost/wooionic",
      // consumerKey: "ck_2c7f3aa593ca3c5b678f506ab0c448f9934ba716",
      // consumerSecret: "cs_896d11add6d9314b9f931928d891abf9313bb3d8",
      url: "https://tunecreativestudios.com/",
      consumerKey: "ck_37b4d0aa6cf0998dd51dcd1b1eb86de5fb749b42",
      consumerSecret: "cs_c5fbe8499453c64ab1eb004a118b1057e6b33045"
    });

    this.WooCommerce.getAsync('products/'+ this.product.id + '/reviews').then((data)=> {
      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews); 
    }, (err) => {
      console.log(err);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product){
    this.storage.get("cart").then((data) => {
        if(data == null || data.length == 0){
          data = [];

          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });
        } else {
          let added = 0;

          for(let i = 0; i < data.length; i++){
            if(product.id == data[i].product.id){
              console.log("Product is already a in cart");

              let qty = data[i].qty;

              data[i].qty = qty + 1;
              data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
              added = 1;
            }
          }

          if(added == 0){
            data.push({
              "product": product,
              "qty": 1,
              "amount": parseFloat(product.price)
            });
          }
        }

        this.storage.set("cart", data).then( ()=> {
          console.log("cart Updated");
          console.log(data);

          this.toasCtrl.create({
            message: "Cart Update",
            duration: 3000
          }).present();
        })
    });
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }

}
