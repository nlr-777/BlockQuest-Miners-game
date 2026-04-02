import { useSensor, useSensors, PointerSensor, TouchSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Custom hook for drag-and-drop sensors optimized for both mobile and desktop
 * - PointerSensor: For mouse interactions on desktop
 * - TouchSensor: For touch interactions on mobile/tablet with better handling
 * - KeyboardSensor: For accessibility (arrow keys)
 */
export const useDndSensors = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require pointer to move 8px before activating drag
      // Prevents accidental drags on click
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      // Touch needs a small delay to distinguish from scroll
      // But keep it short for responsive feel
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return sensors;
};

export default useDndSensors;
