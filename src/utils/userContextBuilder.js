export function buildUserContext(profile) {
    const jobTitle = profile.jobTitle || "Attorney";
    const firm = profile.firm || "Fictional LLP";
    const practiceFocus = profile.practiceFocus || "general legal topics";
    const industryFocus = profile.industryFocus?.trim() || "";
    const targetAudience = profile.targetAudience || "business professionals and in-house counsel";
    const writingGoals = profile.writingGoals || "share insight, demonstrate expertise, and build visibility";
    const tonePreferences = profile.tonePreferences || "professional and accessible";

    let context = `The user is a ${jobTitle} at ${firm}.`;
    context += ` Their practice focus includes ${practiceFocus}.`;

    if (industryFocus) {
        context += ` They focus on industries such as ${industryFocus}.`;
    }

    context += ` Their target audience includes ${targetAudience}.`;
    context += ` Their writing goals are to ${writingGoals}.`;
    context += ` They prefer a tone that is ${tonePreferences}.`;

    return context;
}