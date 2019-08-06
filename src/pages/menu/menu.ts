import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../home/home';
import * as WC from 'woocommerce-api';
import { ProductsByCategory } from '../products-by-category/products-by-category';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {
  WooCommerce: any;
  categories: any[];  
  homePage: any;
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage
    this.categories = [];

      this.WooCommerce = WC({
        // url: "http://localhost/wooionic",
        // consumerKey: "ck_2c7f3aa593ca3c5b678f506ab0c448f9934ba716",
        // consumerSecret: "cs_896d11add6d9314b9f931928d891abf9313bb3d8",
        url: "https://tunecreativestudios.com/",
        consumerKey: "ck_37b4d0aa6cf0998dd51dcd1b1eb86de5fb749b42",
        consumerSecret: "cs_c5fbe8499453c64ab1eb004a118b1057e6b33045",
      });


      this.WooCommerce.getAsync("products/categories").then((data)=> {
          console.log(JSON.parse(data.body).product_categories); 
          
          let temp: any[] = JSON.parse(data.body).product_categories;

          for( let i = 0; i < temp.length; i ++){
            if(temp[i].parent == 0){

              if(temp[i].slug == "clothing"){
                temp[i].icon = "shirt";
              }
              if(temp[i].slug == "music"){
                temp[i].icon = "musical-notes";
              }
              if(temp[i].slug == "posters"){
                temp[i].icon = "images";
              }
              this.categories.push(temp[i])
            }
          }

      }, (err)=> {
        console.log(err)
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category){
    this.childNavCtrl.setRoot(ProductsByCategory, { "category": category });

  }

}
