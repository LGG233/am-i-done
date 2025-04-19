export function isProfileIncomplete(profile) {
    const requiredFields = [
        "practiceFocus",
        "targetAudience",
        "tonePreferences",
        "yearsOfExperience",
    ];
    return requiredFields.some((field) => !profile[field]);
}