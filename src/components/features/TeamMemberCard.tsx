'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TeamMember } from '@/types/team';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-80 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <CardHeader>
        <h3 className="text-2xl font-bold">{member.name}</h3>
        <p className="text-primary font-semibold">{member.role}</p>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-4 mb-4">
          {member.bio}
        </p>

        <div className="flex items-center space-x-3">
          {member.email && (
            <Button
              href={`mailto:${member.email}`}
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Twitter`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

