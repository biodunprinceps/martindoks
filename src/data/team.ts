import { TeamMember } from '@/types/team';
import { getTeamPlaceholder } from '@/lib/image-placeholders';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Omadoko Ogaga',
    role: 'Founder & CEO',
    bio: 'With over a decade of expertise in Nigeria\'s construction landscape, Martin Doks leads Martin Doks Homes as a beacon of innovation and excellence. Renowned for unwavering commitment to delivering reliable solutions to the most intricate construction challenges, earning recognition as a leader for mastery of traditional methods and pioneering use of cutting-edge delivery technologies.',
    image: '/images/team/mr-martin.jpg',
    email: 'martinogaga@martindokshomes.com',
    linkedin: 'https://linkedin.com/in/martindoks',
  },


  {
    id: '2',
    name: 'Otitoola Olufolabi',
    role: 'Sales & Marketing Manager',
    bio: 'With over a decade of expertise in Nigeria\'s construction landscape, Martin Doks leads Martin Doks Homes as a beacon of innovation and excellence. Renowned for unwavering commitment to delivering reliable solutions to the most intricate construction challenges, earning recognition as a leader for mastery of traditional methods and pioneering use of cutting-edge delivery technologies.',
    image: '/images/team/mr-folabi.png',
    email: 'olufolabi@martindokshomes.com',
    linkedin: 'https://www.linkedin.com/in/otitoola-olufolabi/',
  },
  // Add more team members as needed
];

