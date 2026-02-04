'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Award } from '@/types';
import { Trophy, Calendar } from 'lucide-react';

interface AwardCardProps {
  award: Award;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group">
      {award.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={award.image}
            alt={award.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Trophy className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{award.year}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold">{award.title}</h3>
        <p className="text-primary font-semibold">{award.organization}</p>
      </CardHeader>

      {award.description && (
        <CardContent>
          <p className="text-muted-foreground">{award.description}</p>
        </CardContent>
      )}
    </Card>
  );
}

