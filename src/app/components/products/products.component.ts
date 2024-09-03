import { Component, OnInit } from '@angular/core';

type CardContent = {
  title: string;
  description: string;
  imageUrl: string;
};

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  images = [
    {
      title: 'Retarding Admixture',
      name: 'pic1.jpg',
      description: 'Retarding Admixtures are used to delay the rate of setting of concrete. We make available Retarding Admixture that does not decrease the initial temperature of concrete. The bleeding rate and bleeding capacity of concrete is increased with Retarding Admixture. Retarding Admixtures, that we provide, are useful in extending the setting time of concrete, but they are also used in attempts to decrease slump loss and extend workability.'
    },
    {
      title: 'Air Entraining Admixture',
      name: 'pic2.jpg',
      description: 'Air Entraining Admixture, offered by us, is used for stabilizing microscopic air bubbles in concrete. Air Entraining Admixture will dramatically improve the durability of concrete, exposed to cycles of freezing and thawing. This Air Entraining Admixture greatly improves concrete resistance surface scaling. The workability of fresh concrete is improved significantly and segregation & bleeding are reduced/ eliminated with Air Entraining Admixture that we offer.'
    },
    {
      title: 'Plastering Admixture',
      name: 'pic3.jpg',
      description: 'We make available the best quality Plastering Admixture, which is used in internal and external plastering works for higher workability. Plastering Admixture increases strength and reduction in cement by reducing water & cement ratio for improved workability and increased compressive strength. Application of Plastering Admixture over concrete block walls contributes to resistance of walls to absorption of water.'
    },
    {
      title: 'Accelerating Admixture',
      name: 'pic4.jpg',
      description: 'We are engaged in making available premium Accelerating Admixture. Accelerating Admixture, that we offer, is used to accelerate the rate of hydration (setting) and strength development of concrete at an early age. Accelerating Admixture, available with us, is also called quick setting compound. Avail the best quality Accelerating Admixture from us at the leading market prices.'
    },
    {
      title: 'High Quality Heat Resistant Chemical Paint',
      name: 'pic5.jpg',
      description: 'Indo Construction Chemicals is one of the reliable Manufacturers & Suppliers of High Quality Heat Resistant Chemical. We manufacture and offer Heat Resistant Chemical under the brand name of Cool Chem. Our high quality heat resistant chemical is a resistance chemical, which protects your home from ‘Sun” heat. The chemical is prepared by Indian experienced civil engineers guide lines.'
    },
    {
      title: 'Concrete Waterproofing Sealer',
      name: 'pic6.jpg',
      description: 'Concrete Waterproofing Sealer, that we make available, is an excellent product with consistent high quality and proven, dependable efficiency. We make available premium Concrete Waterproofing Sealer that is guaranteed to give the most satisfactory water proofing performance, even in poorly graded cement concrete mix.'
    },
    {
      title: 'Leak Seal Triple Action Cement Water Proofing Liquid',
      name: 'pic7.jpg',
      description: 'It is high quality triple action cement water proofing liquid that protect your new or old building from leakage ,seepage,and improves bonding strength of building.'
    }
  ];
  cards: CardContent[] =[];
  constructor() { }

  ngOnInit(): void {
    const cards: CardContent[] = [];
    this.images.forEach(x => {
      cards.push({
        title: x.title,
        description: x.description,
        imageUrl: `assets/products-images/${x.name}`,
      });
    })

    this.cards = cards;
  }

}
