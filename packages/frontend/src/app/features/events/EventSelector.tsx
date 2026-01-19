import { Select, Spin } from 'antd';
import { useEvents, Event } from './useEvents';

interface EventSelectorProps {
  value?: string;
  onChange?: (eventId: string, event: Event) => void;
}

export function EventSelector({ value, onChange }: EventSelectorProps) {
  const { events, fetching } = useEvents();

  if (fetching) {
    return <Spin size="small" />;
  }

  return (
    <Select
      placeholder="Select an event"
      value={value}
      onChange={(eventId) => {
        const event = events.find((e) => e.id === eventId);
        if (event && onChange) {
          onChange(eventId, event);
        }
      }}
      options={events.map((event) => ({
        value: event.id,
        label: `${event.name} (${event.type})`,
      }))}
    />
  );
}
