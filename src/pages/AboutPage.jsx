import { siteContent } from '../data/siteContent.js';
import { HelpCircle, Waves, Mail, ShieldAlert } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal.js';
import ContactPage from './ContactPage.jsx';

export default function AboutPage() {
  const revealRef = useScrollReveal();

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><HelpCircle size={18} /> Our Story & FAQ</p>
        <h1>About SaltWaterCam</h1>
        <p className="subtitle">Learn about our mission to bring the ocean closer to classrooms, homes, and marine environments.</p>
      </div>

      <div className="aboutContent twoCol">
        <div ref={revealRef}>
          <h2>Connecting curiosity to action.</h2>
          <p>{siteContent.aboutText}</p>
          <p>
            This project was built from the ground up to support high-fidelity stream resolution (1080p), 
            low latency feeds, and mobile responsiveness. It is designed to scale from a single camera to a 
            global multi-camera network.
          </p>
          
          <div className="contactBox">
            <h3><Mail size={18} /> Get in Touch</h3>
            <p>Are you a teacher wanting to use our stream in your classroom? Or a marine researcher? Contact us!</p>
            <a href="mailto:hello@saltwatercam.com" className="emailLink">hello@saltwatercam.com</a>
          </div>
        </div>

        {/* FAQs */}
        <div className="faqSection" ref={revealRef}>
          <h2>Frequently Asked Questions</h2>
          <div className="faqGrid">
            {siteContent.faqs.map((faq, idx) => (
              <div key={idx} className="faqItem">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Contact Form */}
      <div style={{ marginTop: '56px', borderTop: '1px solid rgba(34, 211, 238, 0.15)', paddingTop: '56px' }}>
        <ContactPage isNested={true} />
      </div>
    </div>
  );
}
