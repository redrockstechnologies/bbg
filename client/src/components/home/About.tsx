import { Check, Sparkles, Truck, Headset } from "lucide-react";

const About = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3">About Us</h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="md:flex items-start">
          {/* Image */}
          <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8">
            <img 
              src="https://pixabay.com/get/gcf4376522d5e5a5ba78e14349557e981adcc3f0bfabc5693b3906f081219d16c27e4ff906462c15e6aca815a3726d99597016fe149b0f2fdc93f4684a6dcdff4_1280.jpg" 
              alt="Baby gear collection" 
              className="rounded-lg shadow-md w-full"
            />
          </div>
          
          {/* Content */}
          <div className="md:w-2/3">
            <h3 className="text-2xl mb-4">Your Holiday, Simplified</h3>
            <p className="text-lg mb-4">
              Ballito Baby Gear provides holidaying parents with premium baby equipment rentals, so you can avoid playing Tetris with the boot of your car.
            </p>
            <p className="text-lg mb-4">
              We deliver and collect everything your little one needs during your stay in Ballito, making your family vacation truly effortless.
            </p>
            <p className="text-lg mb-6">
              All our equipment is maintained to the highest standards of safety and cleanliness, because we know that's what matters most to you.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <Sparkles className="text-accent mr-2" size={20} />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center">
                <Check className="text-accent mr-2" size={20} />
                <span>Sanitized Equipment</span>
              </div>
              <div className="flex items-center">
                <Truck className="text-accent mr-2" size={20} />
                <span>Free Delivery & Collection</span>
              </div>
              <div className="flex items-center">
                <Headset className="text-accent mr-2" size={20} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
