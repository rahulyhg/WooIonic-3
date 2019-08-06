import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import {ProductDetails } from '../product-details/product-details';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toasCtrl: ToastController) {
    this.page = 1;

    this.WooCommerce = WC({
      // url: "http://localhost/wooionic",
      // consumerKey: "ck_2c7f3aa593ca3c5b678f506ab0c448f9934ba716",
      // consumerSecret: "cs_896d11add6d9314b9f931928d891abf9313bb3d8",
      url: "https://tunecreativestudios.com/",
      consumerKey: "ck_37b4d0aa6cf0998dd51dcd1b1eb86de5fb749b42",
      consumerSecret: "cs_c5fbe8499453c64ab1eb004a118b1057e6b33045",
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then((data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products
    }, (err) => {
      console.log(err)
    })
  }

  ionViewDidLoad(){
    setInterval(()=> {
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);
        this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event){
    console.log(event);
    if(event == null)
    {
      this.moreProducts = [];
    }else
       this.page ++;

       console.log( this.page);
    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      
      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);

        this.toasCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();
      }
    }, (err) => {
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push( ProductDetails, {"product": product} )
  }
}
