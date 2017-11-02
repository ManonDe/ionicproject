import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {

  app: any = {name: String, version:Number};
  img:String;

  //Constructeur
  constructor(public navCtrl: NavController, private camera: Camera, private base64ToGallery: Base64ToGallery, private localNotifications: LocalNotifications, private mediaCapture: MediaCapture) {
    this.app.name = "AppName";
    this.app.version = 3.0;
  }

  //Options de la caméra
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.ALLMEDIA
  };

  //Fonction qui permet d'utiliser l'appareil photo
  runCamera() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.img = 'data:image/jpeg;base64,' + imageData;
      this.base64ToGallery.base64ToGallery(imageData, {prefix: '_img'}).then(  //enregistre dans la galerie
        res => console.log('Saved image to gallery ', res),
        err => console.log('Error saving image to gallery ', err)
      );
      this.localNotifications.schedule({  //Permet d'envoyer une notification
        id:1,
        text:'Image enregistrée',   //Message de la notification
        data: { secret: "hello" }
      });
      let options: CaptureImageOptions = { limit: 3 };
      this.mediaCapture.captureImage(options)
        .then(
          (data: MediaFile[]) => console.log(data),
          (err: CaptureError) => console.error(err)
        );
    }, (err) => {
      // Handle error
    });
  }

}
