// About.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/about.css';


const About = () => {
  return(
    <div className='content-wrapper'>
      <Header />
    <h2>Why Vegan?</h2>
    <h3>For the animals</h3>
    <p>Preventing the exploitation of animals is not the only reason for becoming vegan, but for many it remains the key factor in their decision to go vegan and stay vegan. Having emotional attachments with animals may form part of that reason, while many believe that all sentient creatures have a right to life and freedom. Specifics aside, avoiding animal products is one of the most obvious ways you can take a stand against animal cruelty and animal exploitation everywhere.</p>
    <h3>For your health</h3>
    <p> Well-planned vegan diets follow healthy eating guidelines, and contain all the nutrients that our bodies need. Some research has linked that there are certain health benefits to vegan diets with lower blood pressure and cholesterol, and lower rates of heart disease, type 2 diabetes and some types of cancer.
    <br></br>
    Going vegan is a great opportunity to learn more about nutrition and cooking, and improve your diet. Getting your nutrients from plant foods allows more room in your diet for health-promoting options like whole grains, fruit, nuts, seeds and vegetables, which are packed full of beneficial fibre, vitamins and minerals.</p>
    <h3>For the environment</h3>
    <p>
      From recycling our household rubbish to cycling to work, we're all aware of ways to live a greener life. One of the most effective things an individual can do to lower their carbon footprint is to avoid all animal products. This goes way beyond the problem of cow flatulence and air pollution!
    </p>
    <h4>Why is meat and dairy so bad for the environment?</h4>
    <p>
      The production of meat and other animal derived products places a heavy burden on the environment. The vast amount of grain feed required for meat production is a significant contributor to deforestation, habitat loss and species extinction. In Brazil alone, the equivalent of 5.6 million acres of land is used to grow soya beans for animals in Europe. This land contributes to developing world malnutrition by driving impoverished populations to grow cash crops for animal feed, rather than food for themselves. On the other hand, considerably lower quantities of crops and water are required to sustain a vegan diet, making the switch to veganism one of the easiest, most enjoyable and most effective ways to reduce our impact on the environment.
    </p>
    <h3>For people</h3>
    <p>
      Just like veganism is the sustainable option when it comes to looking after our planet, plant-based living is also a more sustainable way of feeding the human family. A plant-based diet requires only one third of the land needed to support a meat and dairy diet. With rising global food and water insecurity due to a myriad of environmental and socio-economic problems, there's never been a better time to adopt a more sustainable way of living. Avoiding animal products is not just one of the simplest ways an individual can reduce the strain on food as well as other resources, it's the simplest way to take a stand against inefficient food systems which disproportionately affect the poorest people all over the world.
    </p>
    <p>It's time to ask ourselves: if it is now possible to live a life that involves delicious food and drink, delivers better health, leaves a smaller carbon footprint and avoids killing other creatures - then why don't we?</p>
    <p>Source: <a href='https://www.vegansociety.com/go-vegan/why-go-vegan'>Why Go Vegan</a> from the Vegan Society</p>
    <Footer />
  </div>
  );
};

export default About;
