export const mockClubs = [
  {
    id: 1,
    name: 'Strathmore Tech Society',
    university: 'Strathmore University',
    description: 'Workshops, hackathons and tech talks for student developers.',
    contactEmail: 'tech@example.com',
    logoUrl: null,
    createdAt: '2026-11-20T10:15:00Z',
  },
  {
    id: 2,
    name: 'UoN Music Society',
    university: 'University of Nairobi',
    description: 'Live student bands, open mics and campus concerts.',
    contactEmail: 'music@example.com',
    logoUrl: null,
    createdAt: '2026-11-20T10:20:00Z',
  },
  {
    id: 3,
    name: 'KU Careers Club',
    university: 'Kenyatta University',
    description: 'Career fairs, CV clinics and employer meet-ups.',
    contactEmail: null,
    logoUrl: null,
    createdAt: '2026-11-20T10:25:00Z',
  },
];

// Which mock events belong to which mock club (keyed by club id)
export const mockClubEventIds = {
  1: ['mock-1'],
  2: ['mock-2'],
  3: ['mock-3'],
};
