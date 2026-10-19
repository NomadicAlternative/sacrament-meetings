export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general'
  // 'special' is allowed by the database CHECK constraint, so the type has to
  // allow it too. Otherwise a row with that value would be a lie at runtime.
  | 'special';

// Roles of the branch leadership. The president is the admin who approves the
// membership requests; the two counselors and the secretary have full access;
// the music director can only edit the hymns.
export type Role =
  | 'president'
  | 'first_counselor'
  | 'second_counselor'
  | 'secretary'
  | 'music_director';

// Membership lifecycle: a user requests access (pending), the president
// approves (approved) or denies (rejected) the request.
export type MembershipStatus = 'pending' | 'approved' | 'rejected';

// A user row as the app consumes it (the password hash is never exposed here).
export interface AppUser {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  status: MembershipStatus;
}

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;              // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  // The intermediate hymn sits between the sacrament and closing hymns. It is
  // omitted on the first Sunday of the month, so it may not exist.
  intermediateHymn?: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}