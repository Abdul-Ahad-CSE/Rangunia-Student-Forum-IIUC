/**
 * Format duration between mentorship start and end dates.
 * Output format: "Mentored for 3 months, 14 days" or similar natural language string.
 */
export function formatMentorshipDuration(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined
): string {
  if (!start) return "Duration not recorded";
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();

  const diffMs = Math.max(0, e.getTime() - s.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months > 0 && days > 0) {
    return `Mentored for ${months} month${months > 1 ? "s" : ""}, ${days} day${days > 1 ? "s" : ""}`;
  } else if (months > 0) {
    return `Mentored for ${months} month${months > 1 ? "s" : ""}`;
  } else if (days > 0) {
    return `Mentored for ${days} day${days > 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours > 0) {
      return `Mentored for ${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return "Mentored for 1 day";
  }
}
