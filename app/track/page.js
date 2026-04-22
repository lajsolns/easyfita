import TrackClient from './TrackClient';

export const metadata = {
  title: 'Live Mechanic Tracker – EasyFITA',
  description: 'See available EasyFITA mechanics near you on the live map. Track how close they are and book the nearest one instantly.',
};

export default function TrackPage() {
  return <TrackClient />;
}
