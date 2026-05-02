import React from 'react';
import { HeartHandshake, Lightbulb, Blocks, Handshake, Users } from 'lucide-react';

const valuesData = [
  {
    id: 1,
    title: 'Compassion',
    icon: HeartHandshake,
    text: 'We understand that seeking medical care can be a stressful and emotional experience, and we strive to create a welcoming and supportive environment that puts our patients at ease and every one.',
    offset: false,
  },
  {
    id: 2,
    title: 'Excellence',
    icon: Lightbulb,
    text: 'We are committed to providing excellent medical care and services to our patients. We believe in continuously improving our skills, knowledge, and resources to ensure that we deliver the highest quality care possible.',
    offset: true, 
  },
  {
    id: 3,
    title: 'Integrity',
    icon: Blocks,
    text: "We believe in practicing medicine with integrity and honesty. We are transparent in our communication and decision-making processes, and we always put our patient's interests first & provide best solution.",
    offset: false,
  },
  {
    id: 4,
    title: 'Respect',
    icon: Handshake,
    text: 'We treat all individuals with respect and dignity, regardless of their background, beliefs, or circumstances. We believe that every person deserves to be treated with compassion and kindness.',
    offset: false,
  },
  {
    id: 5,
    title: 'Teamwork',
    icon: Users,
    text: 'We believe in working collaboratively with our team members and other healthcare professionals to provide comprehensive and effective care to our patients.',
    offset: false,
  }
];

const Values = () => {
  return (
    // Increased pt-32 to account for the overlapping ContactBar above it
    <section id="values" className="w-full bg-[#f8fafc] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 lg:mb-28">
          <h2 className="text-4xl md:text-5xl font-black text-[#2b4c7e] tracking-tight">
            Our Values
          </h2>
        </div>

        {/* Cards Container */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          {valuesData.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.id}
                className={`w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2.5rem)] max-w-sm bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col items-center text-center ${
                  value.offset ? 'lg:-translate-y-12' : ''
                }`}
              >
                {/* Updated Icon Wrapper Color */}
                <div className="w-14 h-14 bg-[#2b4c7e] rounded-full flex items-center justify-center text-white mb-6 shadow-md">
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-[#2b4c7e] mb-4">
                  {value.title}
                </h3>
                <p className="text-stone-500 leading-relaxed text-sm">
                  {value.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;