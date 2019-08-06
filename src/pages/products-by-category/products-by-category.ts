import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ProductDetails } from '../product-details/product-details';
import * as WC from 'woocommerce-api';


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategory {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
    this.page = 1;
    this.category = this.navParams.get("category");


    this.WooCommerce = WC({
      // url: "http://localhost/wooionic",
      // consumerKey: "ck_2c7f3aa593ca3c5b678f506ab0c448f9934ba716",
      // consumerSecret: "cs_896d11add6d9314b9f931928d891abf9313bb3d8",
      url: "https://tunecreativestudios.com/",
      consumerKey: "ck_37b4d0aa6cf0998dd51dcd1b1eb86de5fb749b42",
      consumerSecret: "cs_c5fbe8499453c64ab1eb004a118b1057e6b33045",
    });


    
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products
    }, (err) => {
      console.log(err)
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
    this.page ++;
    console.log("Getting page" + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
      let temp = (JSON.parse(data.body).products);
      
      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
        event.complete();

      if(temp.length < 10)
        event.enable(false);
    })
  }

  openProductPage(product){
    this.navCtrl.push( ProductDetails, {"product": product} )
  }
}
