import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryOrder, NgxGalleryAction, NgxGalleryAnimation } from 'ngx-gallery';
import * as $ from 'jquery';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  private pictures = {
    villa : {
      path: '../../assets/Villa/',
      extension: '.jpg',
      pics: [
        '01 piscine 5',
        '02 terrasse sud 5',
        '03 villa face ouest 2',
        '04 piscine 6',
        '05 patio 2',
        '06 BBQ',
        '07 piscine 3',
        '08 piscine',
        '09 piscine 2',
        '10 piscine 4',
        '11 chambre bas 2',
        '12 chambre bas',
        '13 terrasse ouest',
        '14 patio',
        '15 terrasse sud 2',
        '16 terrasse sud 4',
        '17 terrasse sud',
        '18 terrasse sud 3',
        '19 cuisine haut',
        '20 chambre haut',
        '21 chambre haut 2',
        '22 villa face nord-ouest',
        '23 villa face ouest 1',
        '24 villa face ouest 3',
        '25 villa face sud-ouest',
        '26 villa face sud',
        '27 villa face est',
        '28 vue 1',
        '29 vue 3',
        '30 vue 2',]
    },
    environs : {
      path: '../../assets/Alentours/',
      extension: '.jpg',
      pics: [
        '01 situation',
        '02 situation',
        '03 descente vers Mochlos',
        '04 Mochlos',
        '05 Mochlos',
        '06 Mochlos',
        '07 site archeologique',
        '08 Sfaka',
        '09 gorge Richtis',
        '10 gorge Richtis',
        '11 baie de Tholos',
        '12 falaises',
        '13 Gorge Kavousi',
        '14 Gorge Kavousi',
        '15 vautours',
        '16 Tholos beach',
        '17 baie de Tholos',
        '18 Tourloti',
        '19 Lastros',
        '20 falaises'
      ]
    },
    east : {
      path: '../../assets/Crete_Est/',
      extension: '.jpg',
      pics: [
        '01 Monastere de Toplou',
        '02 Monastere de Toplou',
        '03 Monastere de Toplou',
        '04 gorge des morts',
        '05 Agios Nikolaos',
        '06 Agios Nikolaos',
        '07 mont Thripti',
        '08 mont Thripti',
        '09 Sitia',
        '10 gorge de Pefki',
        '11 Spinalonga',
        '12 Spinalonga',
        '13 Plateau de Lassithi',
        '14 Plateau de Lassithi',
        '15 Xerokambos',
        '16 Xerokambos'
      ]
    }
  };

  constructor(private route: ActivatedRoute) {  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');
    const cat = this.pictures[this.route.snapshot.params.id];
    cat.pics.forEach((element: string) => {
      this.galleryImages.push(
        {
          small: cat.path + element + '-' + cat.extension,
          medium: cat.path + element + cat.extension,
          big: cat.path + element + cat.extension,
          description: `${cat.pics.indexOf(element) + 1} / ${cat.pics.length}`
        }
      );
    });

    this.galleryOptions = [
      {
          width: '100%',
          height: Math.ceil(this.galleryImages.length / 6) * 15 + '%',
          thumbnailsColumns: 6,
          thumbnailsRows:  Math.ceil(this.galleryImages.length / 6),
          thumbnailsPercent: 100,
          image: false,
          lazyLoading: true,
          thumbnailsOrder: NgxGalleryOrder.Row,
          previewKeyboardNavigation: true
      },
      // max-width 800
      {
          breakpoint: 800,
          height: Math.ceil(this.galleryImages.length / 4) * 15 + '%',
          thumbnailsColumns: 4,
          thumbnailsRows:  Math.ceil(this.galleryImages.length / 4),
      },
      // max-width 400
      {
          breakpoint: 400,
          height: Math.ceil(this.galleryImages.length / 2) * 15 + '%',
          thumbnailsColumns: 2,
          thumbnailsPercent: 10,
          thumbnailsRows:  Math.ceil(this.galleryImages.length / 2),
      }
    ];
  }
}
