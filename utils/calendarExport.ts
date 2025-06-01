
import { MealPlan, MealItem } from '../types';

// Helper to format date for ICS (YYYYMMDDTHHMMSSZ)
const formatDateToICS = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, "");
};

// Helper to create a UID
const generateUID = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '@yourdomain.com';
};

const mealTimeToCron = (mealKey: keyof MealPlan['dailyMeals'], dayOffset: number, referenceDate: Date): { start: Date, end: Date } => {
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() + dayOffset);
    
    // Define default times for meals
    // These are arbitrary and can be customized
    switch(mealKey) {
        case 'breakfast':
            startDate.setHours(8, 0, 0, 0); // 8:00 AM
            break;
        case 'lunch':
            startDate.setHours(13, 0, 0, 0); // 1:00 PM
            break;
        case 'dinner':
            startDate.setHours(19, 0, 0, 0); // 7:00 PM
            break;
        case 'snacks':
            startDate.setHours(11,0,0,0); // Default snack time 11 AM, can be adjusted
            // Or could have multiple snack times, e.g., 11 AM and 4 PM
            break;
        default:
            startDate.setHours(12,0,0,0); // Default to noon if unknown
    }
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Assume 1 hour duration for meals

    return { start: startDate, end: endDate };
}


const formatMealItemsForDescription = (items: MealItem[]): string => {
  if (!items || items.length === 0) return 'No items specified.';
  return items.map(item => {
    let desc = `- ${item.name}`;
    if (item.portionSuggestion) desc += ` (${item.portionSuggestion})`;
    if (item.alternatives && item.alternatives.length > 0) {
      desc += `\\n  Alternatives: ${item.alternatives.join(', ')}`;
    }
    return desc;
  }).join('\\n');
};


export const exportMealPlanToICS = (plan: MealPlan): void => {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DietaryAssistant//MealPlan//EN
CALSCALE:GREGORIAN
`;
  const today = new Date();

  for (let day = 0; day < 7; day++) { // Create events for 7 days
    Object.keys(plan.dailyMeals).forEach(mealKeyString => {
      const mealKey = mealKeyString as keyof MealPlan['dailyMeals'];
      const mealItems = plan.dailyMeals[mealKey];
      
      if (mealItems && mealItems.length > 0) {
        const { start, end } = mealTimeToCron(mealKey, day, today);
        const summary = `${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}: ${mealItems.map(item => item.name).join(', ')}`;
        
        let description = `Meal Items:\\n${formatMealItemsForDescription(mealItems)}`;
        if (day === 0 && mealKey === 'breakfast' && plan.weeklyVarietyNotes) {
            description += `\\n\\nWeekly Variety Tips: ${plan.weeklyVarietyNotes.replace(/\n/g, '\\n')}`;
        }
         description += `\\n\\nPlan Benefits: ${plan.benefits.replace(/\n/g, '\\n')}`;
         description += `\\nPlan Nuances: ${plan.nuances.replace(/\n/g, '\\n')}`;


        icsContent += `BEGIN:VEVENT
UID:${generateUID()}
DTSTAMP:${formatDateToICS(new Date())}
DTSTART:${formatDateToICS(start)}
DTEND:${formatDateToICS(end)}
SUMMARY:${summary}
DESCRIPTION:${description}
END:VEVENT
`;
      }
    });
  }

  icsContent += 'END:VCALENDAR';

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${plan.planName.replace(/[^a-z0-9]/gi, '_')}_meal_plan.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
