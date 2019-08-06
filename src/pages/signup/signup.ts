import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;
 
  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public toasCtrl: ToastController, 
        public alertCtrl: AlertController
    ) {
    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;


    this.WooCommerce = WC({
      // url: "http://localhost/wooionic",
      // consumerKey: "ck_2c7f3aa593ca3c5b678f506ab0c448f9934ba716",
      // consumerSecret: "cs_896d11add6d9314b9f931928d891abf9313bb3d8",
      url: "https://tunecreativestudios.com/",
      consumerKey: "ck_37b4d0aa6cf0998dd51dcd1b1eb86de5fb749b42",
      consumerSecret: "cs_c5fbe8499453c64ab1eb004a118b1057e6b33045",
    });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  signup(){

    let customerData = {
      customer: {}
    }

    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "usename": this.newUser.username,
      "password": this.newUser.password,
      "billing_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.billing_address.email,
        "phone": this.newUser.billing_address.postcode, 
      },
      "shipping_address":{
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country,   
      }
    }

    if(this.billing_shipping_same){
      this.newUser.shipping_address = this.newUser.shipping_address;
    }

    this.WooCommerce.postAsync('costomers', customerData).then( (data) => {
      let respons = (JSON.parse(data.body));

      if(respons.customer){
        this.alert
      }
    })
  }
  checkEmail(){
    let validEmail = false;
    let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if(reg.test(this.newUser.email)){
      //email looks valid

      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then( (data) =>{
        let res = (JSON.parse(data.body));

        if(res.errors){
          validEmail = true;
         
          this.toasCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000
          }).present();

        } else{
          validEmail = false;
          this.toasCtrl.create({
            message: "Email already registered. Please check.",
           showCloseButton: true
          }).present();
        }
        console.log(validEmail);
      })
    } else {
      validEmail = false;

      this.toasCtrl.create({
        message: "Invalid Email. Please try again",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }
    this.signup(); 
  }
}
